## POST /auth/register

Body (JSON):

{
  "name": "Admin User",
  "email": "admin@gmail.com",
  "password": "Admin@123",
  "role": "admin"
}

{
  "name": "VIP User",
  "email": "vip@gmail.com",
  "password": "Vip@123",
  "role": "vip"
}

{
  "name": "Normal User",
  "email": "normal@gmail.com",
  "password": "User@123",
  "role": "user"
}
{
  "name": "Guest User",
  "email": "guest@gmail.com",
  "password": "Guest@123",
  "role": "guest"
}

Response:

{
    "message": "User registered successfully"
}

## Login User

POST /auth/login

{
  "email": "admin@gmail.com",
  "password": "Admin@123"
}

{
  "email": "vip@gmail.com",
  "password": "Vip@123"
}

{
  "email": "normal@gmail.com",
  "password": "User@123"
}
{
  "email": "guest@gmail.com",
  "password": "Guest@123"
}

Response:

{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6InZpcCIsImVtYWlsIjoidmlwQGdtYWlsLmNvbSIsImlhdCI6MTc2MjE2NDIxMiwiZXhwIjoxNzYyMTgyMjEyfQ.KoqKvYBlL1Fl2lK2ljYJGgCy3pEavhP032PMqdlyI0Q"
}

## Contests
# Create Contest (Admin only)

POST /contests/create

Authorization: Bearer <token>


{
  "name": "Normal Coding Challenge",
  "description": "Basic level challenge for all normal users.",
  "access_level": "normal",
  "start_time": "2025-11-01 10:00:00",
  "end_time": "2025-11-02 23:59:59",
  "prize": "₹500"
}

{
  "name": "VIP Mega Coding Contest",
  "description": "Exclusive coding contest for VIP users.",
  "access_level": "vip",
  "start_time": "2025-11-03 10:00:00",
  "end_time": "2025-11-04 23:59:59",
  "prize": "₹2000"
}

# Get All Contests

GET /contests

Response

{
    "success": true,
    "role": "user",
    "total": 1,
    "contests": [
        {
            "id": 1,
            "name": "Normal Coding Challenge",
            "description": "Basic level challenge for all normal users.",
            "access_level": "normal",
            "start_time": "2025-11-01T04:30:00.000Z",
            "end_time": "2025-11-02T18:29:59.000Z",
            "prize": "₹500",
            "created_by": 1,
            "created_at": "2025-11-02T03:19:30.000Z",
            "type": "normal",
            "contest_type": "normal"
        }
    ]
}

## Add Question (Admin only)

POST /questions/add

Body (JSON):

{
  "contest_id": 1,
  "question_text": "Which language is used for web development?",
  "question_type": "single",
  "options": ["Python", "C++", "JavaScript", "Swift"],
  "correct_option": "JavaScript",
  "points": 10
}
{
  "contest_id": 1,
  "question_text": "What does HTML stand for?",
  "question_type": "single",
  "options": ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyperloop Transfer Machine"],
  "correct_option": "Hyper Text Markup Language",
  "points": 10
}
{
  "contest_id": 1,
  "question_text": "Which of the following are frontend frameworks?",
  "question_type": "multi",
  "options": ["React", "Angular", "Laravel", "Vue"],
  "correct_option": "React,Angular,Vue",
  "points": 15
}
{
  "contest_id": 2,
  "question_text": "Which database is NoSQL?",
  "question_type": "single",
  "options": ["MySQL", "MongoDB", "PostgreSQL", "Oracle"],
  "correct_option": "MongoDB",
  "points": 15
}
{
  "contest_id": 2,
  "question_text": "Node.js runs on which engine?",
  "question_type": "single",
  "options": ["V8", "SpiderMonkey", "Java", "Rhino"],
  "correct_option": "V8",
  "points": 15
}
{
  "contest_id": 2,
  "question_text": "Which of the following are JavaScript frameworks?",
  "question_type": "multi",
  "options": ["React", "Angular", "Laravel", "Vue"],
  "correct_option": "React,Angular,Vue",
  "points": 20
}

Response:

{
    "message": " Question added successfully"
}

## Submit Answers

POST /answers/submit

{
  "contest_id": 1,
  "answers": [
    {
      "question_id": 1,
      "selected_option": "JavaScript"
    },
    {
      "question_id": 2,
      "selected_option": "Hyper Text Markup Language"
    },
    {
      "question_id": 3,
      "selected_option": ["React", "Angular", "Vue"]
    }
  ]
}

{
  "contest_id": 1,
  "answers": [
    { "question_id": 1, "selected_option": "JavaScript" },
    { "question_id": 2, "selected_option": ["React", "Angular", "Vue"] },
    { "question_id": 6, "selected_option": "Hyper Text Markup Language" }
  ]
}

## Leaderboard

GET /leaderboard/:contest_id

Response:

{
    "contest_id": "2",
    "contest_name": "VIP Mega Coding Contest",
    "contest_type": "vip",
    "leaderboard": [
        {
            "user_id": 2,
            "user_name": "VIP User",
            "score": 15,
            "rank_position": 1,
            "contest_type": "vip"
        }
    ]
}

## User History

GET /history/:user_id

{
    "user_id": 2,
    "completed_history": [
        {
            "contest_id": 1,
            "contest_name": "Normal Coding Challenge",
            "contest_type": "normal",
            "status": "completed",
            "score": 25,
            "prize_won": "No Prize"
        },
        {
            "contest_id": 2,
            "contest_name": "VIP Mega Coding Contest",
            "contest_type": "vip",
            "status": "completed",
            "score": 15,
            "prize_won": "₹2000"
        }
    ],
    "in_progress_contests": []
}
