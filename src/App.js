import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Header from './Header';
import './App.css';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function App() {
  //image will be the final image to display with or without lines
  const [image, setImage] = useState(null);

  // the lines can be given by the user input: on change they update to the changed value
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');

  //Gives me the url from the array of objects from .blank
  const [templates, setTemplates] = useState(null);

  useEffect(() => {
    axios.get('https://api.memegen.link/templates').then((res) => {
      setTemplates(res.data);
      setImage(res.data[0].blank);
      // console.log(res.data); will give me an array of objects with all the data I need
    });
  }, []);
  // empty dependency array means this effect will only run once (like componentDidMount in classes)

  const handleChangeMeme = () => {
    const templateUrl = templates[getRandomInt(0, templates.length)].blank;
    setImage(templateUrl);
  };

  const downloadMeme = () => {
    axios({
      url: `${image.slice(0, -4)}/${line1}/${line2}`, //my url
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${line1}/${line2}.png`); //or any other extension
      document.body.appendChild(link);
      link.click();
    });
  };

  return (
    <div className="react-root">
      <Header />
      <div className="content">
        <div>
          <img
            src={
              line1 || line2 ? `${image.slice(0, -4)}/${line1}/${line2}` : image
            }
            alt="meme"
          />
          <div className="lines">
            <label htmlFor="line1">Line 1 </label>
            <input
              id="line1"
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
            />
            <label htmlFor="line2">Line 2</label>
            <input
              id="line2"
              value={line2}
              onChange={(e) => setLine2(e.target.value)}
            />
          </div>
        </div>
        <div>
          <button onClick={handleChangeMeme}>CHANGE MEME</button>
          <button onClick={downloadMeme}>CLICK TO DOWNLOAD</button>
        </div>
      </div>
    </div>
  );
}

export default App;
