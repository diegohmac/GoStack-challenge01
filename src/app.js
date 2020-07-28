const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newProject = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(newProject);

  return response.status(201).json(newProject);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  if (!isUuid(id))
    return response.status(400).json({ error: "Oops! Invalid ID." });

  const projectIndex = repositories.findIndex((repo) => repo.id === id);
  const project = repositories.splice(projectIndex, 1)[0];
  project.title = title;
  project.url = url;
  project.techs = techs;

  repositories.push(project);
  return response.status(200).json(project);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id))
    return response
      .status(400)
      .json({ error: "Oops! There is no repository with this ID." });

  const projectIndex = repositories.findIndex((repo) => repo.id === id);
  repositories.splice(projectIndex, 1);
  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id))
    return response.status(400).json({ error: "Oops! Invalid ID." });

  const projectIndex = repositories.findIndex((repo) => repo.id === id);
  repositories[projectIndex].likes += 1;

  return response.status(200).json(repositories[projectIndex]);
});

module.exports = app;
