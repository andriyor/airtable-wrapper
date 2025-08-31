import { ofetch } from "ofetch";

export const apiFetch = ofetch.create({
  baseURL: process.env.NODE_ENV === "production" ? "" : "http://127.0.0.1:8000",
});
