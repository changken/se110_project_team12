import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ProjectAvatar from './ProjectAvatar'
import DrawingBoard from './DrawingBoard'
import Axios from 'axios'
import moment from 'moment'
import { CircularProgress, Backdrop } from '@material-ui/core'
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
      minWidth: '30px',
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
}))

function CodeBasePage(prop) {
	const classes = useStyles()
  const [commitListData, setCommitListData] = useState([])
  const [dataForCodeBaseChart, setDataForCodeBaseChart] = useState({ labels:[], data: {additions: [], deletions: []} })

  const [currentProject, setCurrentProject] = useState({ })

  const projectId = localStorage.getItem("projectId")
  const jwtToken = localStorage.getItem("jwtToken")

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    Axios.get(`http://localhost:9100/pvs-api/project/1/${projectId}`,
    { headers: {"Authorization" : `${jwtToken}`} })
    .then((response) => {
      setCurrentProject(response.data)
    })
    .catch((e) => {
      alert(e.response.status)
      console.error(e)
    })
  }, [])

  useEffect(() => {
    if(Object.keys(currentProject).length != 0) {
      handleToggle()
      const githubRepo = currentProject.repositoryDTOList.find(repo => repo.type == 'github')
      const query = githubRepo.url.split("github.com/")[1]
      Axios.post(`http://localhost:9100/pvs-api/github/commits/${query}`, "",
      { headers: {"Authorization" : `${jwtToken}`} })
      .then((response) => {
        // todo need reafctor with async
        Axios.get(`http://localhost:9100/pvs-api/github/commits/${query}`,
        { headers: {"Authorization" : `${jwtToken}`} })
          .then((response) => {
            setCommitListData(response.data)
            handleClose()
          })
          .catch((e) => {
           alert(e.response.status)
            console.error(e)
          })
      })
      .catch((e) => {
        alert(e.response.status)
        console.error(e)
      })
    }
  }, [currentProject, prop.startMonth, prop.endMonth])
  
  useEffect(() => {
    const { startMonth, endMonth } = prop

    let chartDataset = { labels:[], data: { additions: [], deletions: []} }
    for (let month = moment(startMonth); month <= moment(endMonth); month=month.add(1, 'months')) {
      chartDataset.labels.push(month.format("YYYY-MM"))

      chartDataset.data.additions.push(commitListData.filter(commit=>{
        return moment(commit.committedDate).format("YYYY-MM") == month.format("YYYY-MM")
      })
      .reduce(function(additionSum, currentCommit) {
          return additionSum + currentCommit.additions;
      }, 0))
      chartDataset.data.deletions.push(commitListData.filter(commit=>{
        return moment(commit.committedDate).format("YYYY-MM") == month.format("YYYY-MM")
      })
      .reduce(function(deletionSum, currentCommit) {
        return deletionSum - currentCommit.deletions;
      }, 0))
    }
    setDataForCodeBaseChart(chartDataset)
  }, [commitListData, prop.startMonth, prop.endMonth])

  return(
    <div style={{marginLeft:"10px"}}>
       <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className={classes.root}>
        <ProjectAvatar 
          size = "small" 
          project={currentProject}
        />
        <p>
          <h2>{currentProject.projectName}</h2>
          
        </p>
      </div>
      <div className={classes.root}>
        <div style={{width: "67%"}}>
          <div>
            <h1>Team</h1>
            <div>
              <DrawingBoard data={dataForCodeBaseChart} isCodeBase={true} id="team-codebase-chart"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    startMonth: state.selectedMonth.startMonth,
    endMonth: state.selectedMonth.endMonth
  }
}

export default connect(mapStateToProps)(CodeBasePage);
