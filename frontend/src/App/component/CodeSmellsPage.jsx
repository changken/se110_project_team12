import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ProjectAvatar from './ProjectAvatar'
import Axios from 'axios'
import { CircularProgress, Backdrop } from '@material-ui/core'
import { connect } from 'react-redux'
import DrawingBoard from './DrawingBoard'
import moment from 'moment'

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

function CodeSmellsPage(prop) {
  const classes = useStyles()
  const [codeSmellList, setCodeSmellList] = useState([])
  const [currentProject, setCurrentProject] = useState(undefined)
  const [codeSmellUrl, setCodeSmellUrl] = useState("")
  const [dataForCodeSmellChart, setDataForCodeSmellChart] = useState({ labels:[], data: { codeSmell: []} })
 
  const projectId = localStorage.getItem("projectId")
  const jwtToken = localStorage.getItem("jwtToken")

  const [open, setOpen] = useState(false)
  const handleClose = () => {
    setOpen(false)
  };
  const handleToggle = () => {
    setOpen(!open)
  };

  useEffect(() => {
    Axios.get(`http://localhost:9100/pvs-api/project/1/${projectId}`,
    { headers: {"Authorization" : `${jwtToken}`} })
    .then(response => {
      setCurrentProject(response.data)
    })
    .catch(e => {
      alert(e.response.status)
      console.error(e)
    })
  }, [])
  
  useEffect(() => {
    handleToggle()
    if(currentProject != undefined) {
      let repositoryDTO = currentProject.repositoryDTOList.find(x => x.type == "sonar")
      let sonarComponent = repositoryDTO.url.split("id=")[1] 
      setCodeSmellUrl(`http://140.124.181.143:9000/project/issues?id=${sonarComponent}&resolved=false&types=CODE_SMELL`)
      Axios.get(`http://localhost:9100/pvs-api/sonar/${sonarComponent}/code_smell`,
      { headers: {"Authorization" : `${jwtToken}`} })
      .then((response) => {
        setCodeSmellList(response.data)
      })
      .catch((e) => {
        alert(e.response.status)
        console.error(e)
      })
    }
  }, [currentProject])

  useEffect(() => {
    let chartDataset = { labels:[], data: { codeSmell: []} }

    codeSmellList.forEach(codeSmell => {
      chartDataset.labels.push(moment(codeSmell.date).format("YYYY-MM-DD HH:mm:ss"))
      chartDataset.data.codeSmell.push(codeSmell.value)
    })

    setDataForCodeSmellChart(chartDataset)
    handleClose()

  }, [codeSmellList, prop.startMonth, prop.endMonth])

  return(
    <div style={{marginLeft:"10px"}}>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className={classes.root}>
        {currentProject&&<ProjectAvatar 
          size = "small" 
          project={currentProject}
        />}
        <p>
          <h2 id="number-of-sonar">{currentProject ? currentProject.projectName : ""}</h2>
        </p>
      </div>
      <h2><a href={codeSmellUrl} target="blank">{dataForCodeSmellChart.data.codeSmell[dataForCodeSmellChart.data.codeSmell.length-1]}</a></h2>
      <div className={classes.root}>
        <div style={{width: "67%"}}>
          <div>
            <h1>Code Smells</h1>
            <div>
              <DrawingBoard data={dataForCodeSmellChart} maxBoardY={Math.max(...dataForCodeSmellChart.data.codeSmell)+5} id="code-smells-chart"/>
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

export default connect(mapStateToProps)(CodeSmellsPage)
