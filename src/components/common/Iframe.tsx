import React, { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../services/context';
import { get } from '../../services/requests';

const Iframe = (props: {src: string}) => {
  const { token } = useContext(UserContext);
  const [content, setContent] = useState("");
  useEffect(() => {
    // async function loadIframeContent() {
    //   const response = await fetch(props.src, {
    //     headers: {
    //       Authorization: 'Token ' + token
    //     }
    //   });
    //   const data = await response.text();
    //   setContent(data);
    //   // const blob = new Blob([data], { type: 'text/html' });
    //   // const iframe = document.getElementById('your_iframe_id_here');
    //   // iframe.srcdoc = `<html><head></head><body>${data}</body></html>`;
    // }
    
    // loadIframeContent();
    get(props.src).then(data => setContent(data.html))
  }, []);

  return (
    <iframe srcDoc={content} width='100%' height='400px'></iframe>
  );
}

export default Iframe;
