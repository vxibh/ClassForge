const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;

const SCOPES = [
  'https://www.googleapis.com/auth/classroom.courses',
  'https://www.googleapis.com/auth/classroom.rosters',
  'https://www.googleapis.com/auth/classroom.announcements',
  'https://www.googleapis.com/auth/classroom.announcements.readonly'
];

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json()); // Middleware to parse JSON request body
app.use(cors({ origin: '*' }));

let credentials;
try {
  credentials = JSON.parse(fs.readFileSync(path.join(__dirname, 'credentials.json')));
  console.log('Credentials loaded:', credentials);
} catch (err) {
  console.error('Error loading credentials:', err);
  process.exit(1);
}

if (!credentials.web) {
  console.error('The credentials file is not correctly formatted. Missing "web" key.');
  process.exit(1);
}

const oAuth2Client = new OAuth2(
  credentials.web.client_id,
  credentials.web.client_secret,
  'http://localhost:3000/oauth2callback'
);

function getAuthUrl() {
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
}

app.get('/', (req, res) => {
  const authUrl = getAuthUrl();
  console.log('Generated auth URL:', authUrl);
  res.render('index', { authUrl });
});

app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    fs.writeFileSync(path.join(__dirname, 'tokens.json'), JSON.stringify(tokens));

    console.log('Tokens obtained:', tokens);
    res.redirect('/courses');
  } catch (err) {
    console.error('Error retrieving access token:', err);
    res.status(500).send('Authentication failed');
  }
});

app.post('/create-classroom', async (req, res) => {
  const { name, section, descriptionHeading, description, room, ownerEmail } = req.body;

  const requestBody = {
    name,
    section,
    descriptionHeading,
    description,
    room,
    ownerId: "me",
    courseState: 'ACTIVE',
  };

  try {
    const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, 'tokens.json')));
    oAuth2Client.setCredentials(tokens);
    const classroom = await createClassroom(oAuth2Client, requestBody);
    res.json({ success: true, classroom });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to handle deleting a course
app.delete('/delete-course/:courseId', async (req, res) => {
  const { courseId } = req.params;

  try {
    const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, 'tokens.json')));
    oAuth2Client.setCredentials(tokens);
    const result = await deleteCourse(oAuth2Client, courseId);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Function to delete a course using Google Classroom API
async function deleteCourse(auth, courseId) {
  const classroom = google.classroom({ version: 'v1', auth });

  try {
    const response = await classroom.courses.delete({
      id: courseId,
    });

    console.log('Deleted Course:', courseId);
    return response.data;
  } catch (error) {
    console.error('Error deleting course:', error.message);
    throw error;
  }
}

// Function to list courses using Google Classroom API
async function listCourses(auth) {
  const classroom = google.classroom({ version: 'v1', auth });
  try {
    const res = await classroom.courses.list({ courseStates: ['ACTIVE'] });
    const courses = res.data.courses;
    return courses || [];
  } catch (err) {
    console.error('Error listing courses:', err);
    return [];
  }
}

// Function to list announcements for a course
async function listAnnouncements(auth, courseId) {
  const classroom = google.classroom({ version: 'v1', auth });
  try {
    const res = await classroom.courses.announcements.list({ courseId });
    const announcements = res.data.announcements;
    return announcements || [];
  } catch (err) {
    console.error('Error listing announcements:', err);
    return [];
  }
}

// Route to list all courses
app.get('/list-courses', async (req, res) => {
  try {
    const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, 'tokens.json')));
    oAuth2Client.setCredentials(tokens);
    const courses = await listCourses(oAuth2Client);
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to list announcements for a course
app.get('/courses/:courseId/announcements', async (req, res) => {
  const { courseId } = req.params;

  try {
    const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, 'tokens.json')));
    oAuth2Client.setCredentials(tokens);
    const announcements = await listAnnouncements(oAuth2Client, courseId);
    res.json({ success: true, announcements });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

async function createClassroom(auth, requestBody) {
  const classroom = google.classroom({ version: 'v1', auth });
  try {
    const response = await classroom.courses.create({ requestBody });
    console.log('Created Classroom:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating classroom:', error.message);
    throw error;
  }
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
