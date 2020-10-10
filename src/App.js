/* eslint-disable jsx-a11y/alt-text */
import React, { useRef, useEffect, useState } from "react";
import Loader from "./components/Loader";
import { nhentaiCrawler, nhentaiByPass } from "./endpoints";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [arrayOfImage, setArrayOfImage] = useState([]);
  const [lazyDisplayImage, setLazyDisplayImage] = useState([]);

  /**
   * initial IO for switch preview to original image
   */
  const IO = useRef(
    new IntersectionObserver(
      (entry) => {
        entry.forEach((entries) => {
          if (entries.isIntersecting) {
            entries.target.setAttribute(
              "src",
              entries.target.getAttribute("loader")
            );
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.5 }
    )
  );

  const lazyloadIO = useRef();
  const lazyDisplayImageLength = useRef();
  const lastBottomElement = useRef();

  /**
   * fetch image
   */
  useEffect(() => {
    (async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const source = urlParams.get("source");
      const fetchResult = await fetch(`${nhentaiCrawler}${source}`);
      const { success, arrayOfImage: image } = await fetchResult.json();
      if (success) {
        setArrayOfImage([...image]);
        setLazyDisplayImage([...image.filter((x, y) => y < 5)]);
        lazyDisplayImageLength.current = image.filter((x, y) => y < 5).length;
        setLoading(false);
      } else if (!success) {
        setLoading(false);
        setError(true);
      }
    })();
  }, []);

  // IO configuration
  useEffect(() => {
    if (!loading && arrayOfImage.length > 0) {
      lazyloadIO.current = new IntersectionObserver((entry) => {
        entry.forEach((entries) => {
          if (entries.isIntersecting) {
            if (lazyDisplayImageLength.current < arrayOfImage.length) {
              setLazyDisplayImage((prev) => [
                ...prev,
                arrayOfImage[lazyDisplayImageLength.current],
              ]);
              lazyDisplayImageLength.current += 1;
            }
          }
        });
      });
    }
  }, [arrayOfImage, loading]);

  // io observe
  useEffect(() => {
    if (!loading && arrayOfImage.length > 0) {
      lazyloadIO.current.observe(lastBottomElement.current);
    }
  }, [arrayOfImage.length, loading]);

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <h1>something error, i'm fixing it</h1>;
  }

  return (
    <>
      <h6 style={{ textAlign: "center" }}>
        wait for the blur, it's saving your internet quota
      </h6>
      {lazyDisplayImage.map((x, y) => {
        return (
          <img
            id={`nhentai-page-${y}`}
            style={{
              width: "100%",
              height: "auto",
            }}
            src={`${nhentaiByPass}${x.preview}`}
            loader={`${nhentaiByPass}${x.original}`}
            onLoad={() => {
              IO.current.observe(document.getElementById(`nhentai-page-${y}`));
            }}
          />
        );
      })}
      <div
        style={{
          height: 48,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        ref={lastBottomElement}
      >
        <p>
          {lazyDisplayImage.length === arrayOfImage.length
            ? "The End"
            : "loading"}
        </p>
      </div>
    </>
  );
}

export default App;
