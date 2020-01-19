import React from 'react'
import { render } from 'react-dom'
import ckeditor from '@ckeditor/ckeditor5-react'


class Xfield {
  render () {
    console.log(this.props);
    console.log(ckeditor);
    return (
      <div>
        xfield
      </div>
    )
  }
}
export default Xfield
