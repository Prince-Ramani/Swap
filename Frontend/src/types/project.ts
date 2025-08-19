interface ApiError {
  error: string;
}

//deleteProject

export interface deleteProjectRequest {
  projectID: string;
}

export interface deleteProjectSuccess {
  message: string;
}

export type deleteProjectResponse = deleteProjectSuccess | ApiError;
