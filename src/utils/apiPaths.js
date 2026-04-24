export const BASE_URL = import.meta.env.VITE_API_URL;

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",  //signup
    LOGIN: "/api/auth/login",  //Authenticate user  return JWT token
    GET_PROFILE: "/api/auth/profile",  //get logged-in user details
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",  //upload profile picture
  },
  AI: {
    GENERATE_QUESTION: "/api/ai/generate-questions",  //generate interview questions and answers using gemini
    GENERATE_EXPLANATION: "/api/ai/generate-explanation",  //generate concept explanation using gemini
  },
  SESSION: {
    CREATE: "/api/sessions/create",  //create a new interview session with questions
    GET_ALL: "/api/sessions/my-sessions",
    GET_ONE: (id) => `/api/sessions/${id}`, //get session details with questions
    DELETE: (id) => `/api/sessions/${id}`,  //delete a session
  },

  QUESTION: {
    ADD_TO_SESSION: "/api/questions/add",  //add more questions to a session
    PIN: (id) => `/api/questions/${id}/pin`,  //pin or unpin a question
    UPDATE_NOTE: (id) => `/api/questions/${id}/note`,  //update/add a note to a question
  },
};