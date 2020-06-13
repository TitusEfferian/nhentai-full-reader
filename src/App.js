/* eslint-disable jsx-a11y/alt-text */
import React, { useRef, useEffect, useState } from 'react';
import Loader from './components/Loader';
import ImageContainer from './components/ImageContainer';
import ImageLoader from './components/ImageLoader';
import { nhentaiCrawler, nhentaiByPass } from './endpoints';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [arrayOfImage, setArrayOfImage] = useState([]);
  /**
   * initial IO
   */
  const IO = useRef(new IntersectionObserver((entry) => {
    entry.forEach(entries => {
      if (entries.isIntersecting) {
        entries.target.firstChild.setAttribute('src', entries.target.firstChild.getAttribute('loader'));
        entries.target.firstChild.onload = () => {
          entries.target.firstChild.style.height = 'auto';
          if(entries.target.childElementCount === 2) {
            entries.target.removeChild(entries.target.lastChild);
          }
        }
      }
    })
  }, { root: null, rootMargin: '0px', threshold: [0.25, 0.5, 1.0] }));

  const imgElement = useRef([]);

  /**
   * fetch image
   */
  useEffect(() => {
    (async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const source = urlParams.get('source');
      const fetchResult = await fetch(`${nhentaiCrawler}${source}`);
      const { success, arrayOfImage: image } = await fetchResult.json();
      if (success) {
        setLoading(false);
        setArrayOfImage([...image]);
      }
      else if(!success) {
        setLoading(false);
        setError(true);
      }
    })()
  }, [])

  /**
   * observe io
   */
  useEffect(() => {
    if (!loading) {
      for (let a = 0; a < arrayOfImage.length; a++) {
        IO.current.observe(imgElement.current[a])
      }
    }
  }, [arrayOfImage.length, loading])
  
  if (loading) {
    return (
      <Loader />
    )
  }
  if(error) {
    return(
      <h1>something error, i'm fixing it</h1>
    )
  }
  return arrayOfImage.map((x,y) => {
    if(y<5) {
      return (
        <ImageContainer imgElement={imgElement}>
          <img style={styles.imgStyles} alt="img" src={`${nhentaiByPass}${x.preview}`} loader={`${nhentaiByPass}${x.original}`} />
        </ImageContainer>
      )
    }
    return (
      <ImageContainer imgElement={imgElement}>
        <img style={styles.imgStyleLazy} loader={`${nhentaiByPass}${x.original}`} />
        <ImageLoader />
      </ImageContainer>
    )
  })
}

const styles = {
  imgStyles: {
    width: '100%',
    height: 'auto',
  },
  imgStyleLazy: {
    width: '100%',
    height: '85vh',
    backgroundColor: 'grey',
  }
}

export default App;
