import React, { useState } from "react";
import "../My Projects/projects.css";
import Sidebar from "../Sidebar/side";
import Modal from "react-modal";
import axios from "axios";
import localStorage from "react-secure-storage";
import logo from "/src/assets/cthLogo.png";
import { SpinnerRing } from "loaders-ui";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faCancel,
  faClose,
  faAdd,
  faEdit,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { faAd } from "@fortawesome/free-solid-svg-icons/faAd";

Modal.setAppElement("#root");

function Projects() {
  const maxDescriptionLength = 150;
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    githubUrl: "",
  });

  const [editProject, setEditProject] = useState({
    index: null,
    title: "",
    description: "",
    githubUrl: "",
  });

  const [theProjects, setTheProjects] = useState([]);

  const filteredProjects = theProjects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProject = async () => {
    let userId = localStorage.getItem("userId");
    let token = localStorage.getItem("token");

    const apiURL =
      "https://cth-interns-portal.onrender.com/api/intern/project/new";

    setIsLoading(true);

    try {
      const response = await axios.post(
        apiURL,
        {
          InternId: userId,
          title: newProject.title,
          description: newProject.description,
          githubUrl: newProject.githubUrl,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const createdProject = response.data;

      setTheProjects((prev) => [...prev, createdProject]);

      // Show success toast
      toast.success("New project added successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("There was an error adding the project.");
    } finally {
      setIsLoading(false);
    }

    setNewProject({
      title: "",
      description: "",
      githubUrl: "",
    });
    setModalIsOpen(false);
  };

  const handleEditProject = () => {
    setTheProjects((prev) =>
      prev.map((project, i) =>
        i === editProject.index ? editProject : project
      )
    );
    setEditProject({
      index: null,
      title: "",
      description: "",
      githubUrl: "",
    });
    setEditModalIsOpen(false);
    toast.success("Project updated successfully!");
  };

  const handleDeleteProject = (index) => {
    setTheProjects((prev) => prev.filter((_, i) => i !== index));
    toast.success("Project deleted successfully!");
  };

  const openEditModal = (index) => {
    setEditProject({ ...theProjects[index], index });
    setEditModalIsOpen(true);
  };

  return (
    <>
      <div className="parent">
        <Sidebar />
        <div className="right-side">
          <div className="p-nav">
            <h1>PROJECTS</h1>
            <div className="user-info">
              <h2>Username</h2>
              <p>Intern</p>
            </div>
          </div>
          <div className="bar">
            <div className="input-field">
              <input
                type="search"
                placeholder="Search Project"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={() => setModalIsOpen(true)}>New Project</button>
          </div>
          <div className="projects">
            {theProjects.length === 0 ? (
              <div className="empty-projects">
                <h2>Add New Project</h2>
              </div>
            ) : (
              <div className="project-card">
                <div className="intern-card">
                  <div className="interns">
                    {filteredProjects.map((project, index) => (
                      <div key={index} className="project-item">
                        <div className="project-info">
                          <h3>{project.title}</h3>
                          <p className="description">{project.description}</p>
                          <p>Github URL: {project.githubUrl}</p>
                        </div>
                        <div className="buttons">
                          <button
                            className="edit"
                            onClick={() => openEditModal(index)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            className="delete"
                            onClick={() => handleDeleteProject(index)}
                          >
                            <FontAwesomeIcon icon={faTrashCan} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Add New Project"
            className="modal"
            overlayClassName="overlay"
          >
            <div className="modals">
              <img className="modal-logo" src={logo} alt="Modal Logo" />

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddProject();
                }}
              >
                <label>
                  Title:
                  <input
                    type="text"
                    name="title"
                    value={newProject.title}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Description:
                  <p className="character">
                    {newProject.description.length}/{maxDescriptionLength}
                  </p>
                  <input
                    name="description"
                    value={newProject.description}
                    maxLength={maxDescriptionLength}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Github URL:
                  <input
                    type="text"
                    name="githubUrl"
                    value={newProject.githubUrl}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <div className="modal-buttons">
                  {isLoading ? (
                    <div className="spinner-container">
                      <SpinnerRing
                        color="white"
                        borderWidth={4}
                        width="1.5rem"
                      />
                    </div>
                  ) : (
                    <button className="add-up" type="submit">
                      <FontAwesomeIcon icon={faAdd} />
                    </button>
                  )}

                  <button
                    className="cancel"
                    type="button"
                    onClick={() => setModalIsOpen(false)}
                  >
                    <FontAwesomeIcon icon={faClose} />
                  </button>
                </div>
              </form>
            </div>
          </Modal>

          <Modal
            isOpen={editModalIsOpen}
            onRequestClose={() => setEditModalIsOpen(false)}
            contentLabel="Edit Project"
            className="modal"
            overlayClassName="overlay"
          >
            <div className="modals">
              <img className="modal-logo" src={logo} alt="Modal Logo" />
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditProject();
                }}
              >
                <label>
                  Title:
                  <input
                    type="text"
                    name="title"
                    value={editProject.title}
                    onChange={handleEditInputChange}
                    required
                  />
                </label>
                <label>
                  Description:
                  <input
                    name="description"
                    value={editProject.description}
                    onChange={handleEditInputChange}
                    required
                  />
                </label>

                <label>
                  Github URL:
                  <input
                    type="text"
                    name="githubUrl"
                    value={editProject.githubUrl}
                    onChange={handleEditInputChange}
                    required
                  />
                </label>

                <div className="modal-buttons">
                  <button type="submit">
                    {" "}
                    <FontAwesomeIcon icon={faSave} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditModalIsOpen(false)}
                  >
                    <FontAwesomeIcon icon={faClose} />
                  </button>
                </div>
              </form>
            </div>
          </Modal>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default Projects;
