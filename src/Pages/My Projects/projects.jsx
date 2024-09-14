import React, { useState, useEffect } from "react";
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
  faClose,
  faAdd,
  faEdit,
  faTrashCan,
  faEllipsisV,
  faLink,
  faRocket,
  faCalendar,
  faCalendarAlt,
  faCalendarDay,
} from "@fortawesome/free-solid-svg-icons";

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
    hostedUrl: "",
    timestamp: "",
  });

  const [editProject, setEditProject] = useState({
    index: null,
    title: "",
    description: "",
    githubUrl: "",
    hostedUrl: "",
    timestamp: "",
  });

  const [projects, setProjects] = useState([]);
  const [visibleButtons, setVisibleButtons] = useState(null);

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
      await axios.post(apiURL, {
        InternId: userId,
        title: newProject.title,
        description: newProject.description,
        timestamp: newProject.date,
      });
      getProject();
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
      hostedUrl: "",
      timestamp: "",
    });
    setModalIsOpen(false);
  };

  const getProject = async () => {
    let userId = localStorage.getItem("userId");

    const apiURL = `https://cth-interns-portal.onrender.com/api/intern/projects/all/${userId}`;

    try {
      setIsLoading(true);

      const response = await axios.get(apiURL);

      const createdProject = response.data;
      console.log(createdProject);
      setProjects(createdProject);
    } catch (error) {
      console.error("Error:", error);
      toast.error("There was an error fetching the projects.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProject = () => {
    setProjects((prev) =>
      prev.map((project, i) =>
        i === editProject.index ? editProject : project
      )
    );
    setEditProject({
      index: null,
      title: "",
      description: "",
      githubUrl: "",
      hostedUrl: "",
      timestamp: "",
    });
    setEditModalIsOpen(false);
    toast.success("Project updated successfully!");
  };

  const handleDeleteProject = async (projectId) => {
    try {
      // const projectId = projects[index].id; 
  
      const apiURL = `https://cth-interns-portal.onrender.com/api/intern/project/delete/${projectId}`;
  
      await axios.delete(apiURL, {
        // headers: {
        //   Authorization: `Bearer ${token}`
        // }
      });
  
      // setProjects((prev) => prev.filter((_, i) => i !== index));
      toast.success("Project deleted successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response.data);
    }
  };
  

  const openEditModal = (index) => {
    setEditProject({ ...projects[index], index });
    setEditModalIsOpen(true);
  };

  const toggleButtons = (index) => {
    setVisibleButtons(visibleButtons === index ? null : index);
  };

  const copyGitUrl = (url) => {
    navigator.clipboard.writeText(url).then(
      () => {
        toast.success("GitHub URL copied to clipboard!");
      },
      (err) => {
        toast.error("Failed to copy the URL.");
      }
    );
  };

  const copyHostingUrl = (url) => {
    navigator.clipboard.writeText(url).then(
      () => {
        toast.success("Hosting URL copied to clipboard!");
      },
      (err) => {
        toast.error("Failed to copy the URL.");
      }
    );
  };

  useEffect(() => {
    getProject();
  }, []);

  return (
    <>
      <div className="parent">
        <Sidebar />
        <div className="right-side">
          <div className="p-nav">
            <span>
              <FontAwesomeIcon icon={faRocket} />
              <h1>PROJECTS</h1>
            </span>
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
            {isLoading ? (
              <div className="spin">
                <SpinnerRing color="blue" borderWidth={7} width="3.1rem" />
              </div>
            ) : projects.length === 0 ? (
              <div className="empty-projects">
                <h2>Add New Project</h2>
              </div>
            ) : (
              <div className="project-card">
                <div className="intern-card">
                  <div className="interns">
                    {projects
                      .filter((project) =>
                        project.title
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      )
                      .map((project, index) => (
                        <div key={index} className="project-item">
                          <div className="project-info">
                            <div className="title-n-dots">
                              <h3>{project.title}</h3>
                              <div className="dot-edit-delete">
                                {visibleButtons === index && (
                                  <div className="buttons">
                                    <button
                                      className="delete"
                                      onClick={() => handleDeleteProject(project._id)}
                                    >
                                      <FontAwesomeIcon icon={faTrashCan} />
                                    </button>
                                    <button
                                      className="edit"
                                      onClick={() => openEditModal(index)}
                                    >
                                      <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                  </div>
                                )}
                                <FontAwesomeIcon
                                  className="custom-icon"
                                  icon={
                                    visibleButtons === index
                                      ? faClose
                                      : faEllipsisV
                                  }
                                  onClick={() => toggleButtons(index)}
                                />
                              </div>
                            </div>
                            <p className="description">{project.description}</p>
                            <div className="url-parent">
                              <div className="url-card">
                                <p>GitHub URL</p>
                                <button
                                  onClick={() => copyGitUrl(project.githubUrl)}
                                  className="copy-link"
                                >
                                  <FontAwesomeIcon icon={faLink} />
                                </button>
                              </div>
                              <div className="url-card">
                                <p>Hosted URL</p>
                                <button
                                  onClick={() =>
                                    copyHostingUrl(project.hostedUrl)
                                  }
                                  className="copy-link"
                                >
                                  <FontAwesomeIcon icon={faLink} />
                                </button>
                              </div>
                            </div>
                            <div className="calendar">
                              <FontAwesomeIcon icon={faCalendarDay} />
                              <p>
                                {new Date(
                                  project.timestamp
                                ).toLocaleDateString()}
                              </p>
                            </div>
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
                <label>
                  Hosted URL:
                  <input
                    type="text"
                    name="hostedUrl"
                    value={newProject.hostedUrl}
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
                    className="close-button"
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
                  <p className="character">
                    {editProject.description.length}/{maxDescriptionLength}
                  </p>
                  <input
                    name="description"
                    value={editProject.description}
                    maxLength={maxDescriptionLength}
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
                <label>
                  Hosted URL:
                  <input
                    type="text"
                    name="hostedUrl"
                    value={newProject.hostedUrl}
                    onChange={handleEditInputChange}
                    required
                  />
                </label>

                <div className="modal-buttons">
                  <button className="add-up" type="submit">
                    <FontAwesomeIcon icon={faSave} />
                  </button>
                  <button
                    className="close-button"
                    type="button"
                    onClick={() => setEditModalIsOpen(false)}
                  >
                    <FontAwesomeIcon icon={faClose} />
                  </button>
                </div>
              </form>
            </div>
          </Modal>
          <ToastContainer />
        </div>
      </div>
    </>
  );
}

export default Projects;
