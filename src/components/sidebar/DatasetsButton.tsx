const DatasetsButton = (props: {onClick: any}) => {
  return (
    <div className='new-conv' onClick={props.onClick} style={{paddingLeft: '2.3em'}}>Manage Datasets
    </div>
  )
}

export default DatasetsButton;
