import React from 'react';
import { CircularProgress } from '@mui/material';
import { green } from '@mui/material/colors';
import axios from 'axios';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function GithubAuthorize() {
  const location = useLocation();

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken');

    const urlSearchParams = new URLSearchParams(location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const code = params['code'];
    const host = 'http://localhost:9100/pvs-api/oauth/github';
    let payload = {
      code: code,
    };

    axios
      .post(host, payload, {
        headers: { Authorization: `${jwtToken}` },
      })
      .then(res => {
        localStorage.setItem('token', res.data);
      })
      .catch(err => {
        console.log('err');
      });
    var timer = setInterval(() => {
      clearInterval(timer);
      window.close();
    }, 1000);
  });

  return (
    <div>
      <CircularProgress
        size={96}
        sx={{
          color: green[500],
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginTop: '-48px',
          marginLeft: '-48px',
        }}
      />
    </div>
  );
}
