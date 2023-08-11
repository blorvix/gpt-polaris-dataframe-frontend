import { useEffect, useState } from 'react';
import { getJson } from '../../services/requests';
import { CircularProgress } from '@mui/material';

const Iframe = (props: {src: string, height: string}) => {
  const [content, setContent] = useState("");
  useEffect(() => {
    setContent('')
    getJson(props.src).then(data => {
      const blob = new Blob([data.html], { type: 'text/html' })
      const obj = URL.createObjectURL(blob)
      setContent(obj)
    })
  }, [props.src]);

  return (
    <div style={{height: props.height}}>
      {content.length ? (
        <iframe src={content} width='100%' height='100%' frameBorder={0}></iframe>
      ): (
        <div className='progress-wrapper'>
            <CircularProgress />
        </div>
      )}
    </div>
  );
}

export default Iframe;
