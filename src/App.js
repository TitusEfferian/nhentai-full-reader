import React, { useRef, useEffect, useState } from 'react';
import Loader from './components/Loader';

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
        entries.target.setAttribute('src', entries.target.getAttribute('loader'));
        entries.target.onload = () => {
          entries.target.style.height = '';
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
      const fetchResult = await fetch(`https://asia-east2-fleet-range-273715.cloudfunctions.net/nhentai-crawler?nhentaiId=${source}`);
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
  return arrayOfImage.map(x => {
    return (
      // eslint-disable-next-line jsx-a11y/alt-text
      <img ref={ref => imgElement.current.push(ref)} style={{ width: '100%', height: '85vh',backgroundColor:'grey' }} src={`https://nhentai-bypass-original-uu6sxpl27a-de.a.run.app?source=${x.preview}`} loader={`https://nhentai-bypass-original-uu6sxpl27a-de.a.run.app?source=${x.original}`} />
    )
  })
}

export default App;
