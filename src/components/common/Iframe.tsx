import { useEffect, useState } from 'react';
import { getJson } from '../../services/requests';

const Iframe = (props: {src: string}) => {
  const [content, setContent] = useState("");
  useEffect(() => {
    getJson(props.src).then(data => {
      const blob = new Blob([data.html], { type: 'text/html' })
      const obj = URL.createObjectURL(blob)
      setContent(obj)
    })
  }, []);

  return (
    <iframe src={content} width='100%' height='400px' frameBorder={0}></iframe>
  );
}

export default Iframe;
