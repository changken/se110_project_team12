import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Axios from 'axios';
import { 
  Card, 
  CardActionArea, 
  IconButton
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import ProjectAvatar from './ProjectAvatar';
import { useEffect } from 'react';
import AddProjectDialog from './AddProjectDialog';
import { connect } from 'react-redux';
import { setCurrentProjectId } from '../../redux/action';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
    flexWrap: 'wrap'
  },
  small: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  large: {
    width: theme.spacing(20),
    height: theme.spacing(25),
  },
  createProjectCard: {
    height: theme.spacing(25)
  }
}));

function SelectProject({ setCurrentProjectId }) {
  const classes = useStyles()
  const [addRepoDialogOpen, setAddRepoDialogOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const jwtToken = localStorage.getItem("jwtToken")

  const loadProjects = () => {
    Axios.get("http://localhost:9100/pvs-api/project/1",
     { headers: {"Authorization" : `${jwtToken}`} })
    .then((response) => {
      setProjects(response.data)
    })
    .catch((e) => {
      alert(e.response.status);
      console.error(e)
    }) 
  }

  useEffect(() => {
    setCurrentProjectId(0)
    loadProjects();
  }, [])

  return (
    <div>
      <h1>Projects</h1>
    
      <div className={classes.root}>
        {projects.map( project =>
          <ProjectAvatar size="large" project={project} reloadProjects={loadProjects}/>
        )}
        <Card id="create-project-card" className={classes.createProjectCard}>
          <CardActionArea onClick={() => setAddRepoDialogOpen(true)}>
            <IconButton color="primary" className={classes.large}  disabled>
              <Add className={classes.small}/>
            </IconButton>
          </CardActionArea>

        </Card>
        <AddProjectDialog
            open={addRepoDialogOpen} 
            reloadProjects={loadProjects}
            handleClose={() => setAddRepoDialogOpen(false)}
            />
      </div>
    </div>
  )
}

export default connect(null, {setCurrentProjectId})(SelectProject)