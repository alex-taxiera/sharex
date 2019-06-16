import React from 'react'
import { connect } from 'react-redux'

import { fetchImages } from '../../redux/operations'

import { SEO } from '../../components/seo'
import { FileLoader } from '../../components/file-loader'

import './index.scss'

function Images ({ images }) {
  return (
    <div className="images">
      <SEO
        title="Images"
      />
      <FileLoader
        className="image-files"
        files={images}
        loader={fetchImages}
        display={(image, key) => (
          <div className="image" key={key}>
            <a
              href={image.name.split('.')[0]}
              target="_blank"
            >
              <img
                src={image.name}
              />
            </a>
          </div>
        )}
      />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    images: state.images
  }
}

export default connect(mapStateToProps)(Images)
