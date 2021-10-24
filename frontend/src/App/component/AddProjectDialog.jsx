import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import InputAdornment from '@material-ui/core/InputAdornment';
import { SiGithub, SiSonarqube } from 'react-icons/si'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from '@material-ui/core'

export default function AddProjectDialog({ open, reloadProjects, handleClose }) {
    const [projectName, setProjectName] = useState("")
    const [githubRepositoryURL, setGithubRepositoryURL] = useState("")
    const [sonarRepositoryURL, setSonarRepositoryURL] = useState("")
    const [isGithubAvailable, setIsGithubAvailable] = useState(false)
    const [isSonarAvailable, setIsSonarAvailable] = useState(false)
    const jwtToken = localStorage.getItem("jwtToken")

    const createProject = () => {
      let checker = []
      if(projectName === "" || (githubRepositoryURL === "" && sonarRepositoryURL === "")) {
        alert("不準啦馬的>///<")
      } else {
        if(githubRepositoryURL !== "") {
          checker.push(checkGithubRepositoryURL());
        }
        if(sonarRepositoryURL !== "") {
          checker.push(checkSonarRepositoryURL());
        }

        Promise.all(checker)
          .then((response)=> {
            if(response.includes(false) == false) {
              let payload = {
                projectName : projectName,
                githubRepositoryURL : githubRepositoryURL,
                sonarRepositoryURL : sonarRepositoryURL
              }
              
              Axios.post("http://localhost:9100/pvs-api/project", payload,
              { headers: {"Authorization" : `${jwtToken}`} })
                 .then((response) => {
                    reloadProjects()
                    handleClose()
                 })
                 .catch((e) => {
                    alert(e.response.status)
                    console.error(e)
                 }) 
            }
          }).catch((e) => {
            alert(e.response.status)
            console.error(e)
          })
      }
    }

    const checkGithubRepositoryURL = () => {
      return Axios.get(`http://localhost:9100/pvs-api/repository/github/check?url=${githubRepositoryURL}`,
      { headers: {"Authorization" : `${jwtToken}`} })
      .then((response) => {
        setIsGithubAvailable(true);
        return true
      })
      .catch((e) => {
        alert("github error")
        return false
      }) 
    }

    const checkSonarRepositoryURL = () => {
      return Axios.get(`http://localhost:9100/pvs-api/repository/sonar/check?url=${sonarRepositoryURL}`,
      { headers: {"Authorization" : `${jwtToken}`} })
      .then((response) => {
        setIsSonarAvailable(true);
        return true
      })
      .catch((e) => {
        alert("sonar error")
        console.error(e)
        return false
      }) 
    }

    useEffect(() => {
      setProjectName("")
      setGithubRepositoryURL("")
      setSonarRepositoryURL("")
    }, [open])
    
    return (
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Create Project</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To create a project, please enter the project name and the repository URL you want to subscribe here.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="ProjectName"
              label="Project Name"
              type="text"
              fullWidth
              onChange = {(e) => {setProjectName(e.target.value)}}
            />
            <TextField
              margin="dense"
              id="GithubRepositoryURL"
              label="Github Repository URL"
              type="text"
              fullWidth
              onChange = {(e) => {setGithubRepositoryURL(e.target.value)}}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SiGithub />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              margin="dense"
              id="SonarRepositoryURL"
              label="Sonar Repository URL"
              type="text"
              fullWidth
              onChange = {(e) => {setSonarRepositoryURL(e.target.value)}}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SiSonarqube />
                  </InputAdornment>
                ),
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button id="CreateProjectBtn" onClick={createProject} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
    )
  }
  