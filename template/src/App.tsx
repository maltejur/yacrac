import React from "react";

export default () => (
  <div className="page">
    <img src="/logo.svg" />
    <h1>Welcome to yacrac!</h1>
    <p>
      Edit <code>src/App.tsx</code> and save to reload.
    </p>
    <style jsx global>{`
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        margin: 0;
      }
    `}</style>
    <style jsx>{`
      .page {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background-color: #282c34;
        color: white;
      }

      @keyframes spinning {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      img {
        animation: spinning 20s linear infinite;
        width: 200px;
        height: 200px;
      }

      h1 {
        margin: 50px 0 10px 0;
        font-size: 40px;
      }

      p {
        font-size: 20px;
      }

      code {
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 3px;
        padding: 5px;
        margin: 0 3px;
        font-size: 16px;
      }
    `}</style>
  </div>
);
