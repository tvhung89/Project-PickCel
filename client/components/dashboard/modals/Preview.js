import React, {Component} from 'react'
import clientUtils from '../../../utils'

class Preview extends Component {
    constructor(props) {
        super(props)

        this.state = {
            asset: null,
            isIframe: false,
            modalWidth: 0,
            isClose: false,
            isTempPreview: false
        }   
    }

    componentDidMount() {
        const self = this

        if (window.jQuery) {
            const modal = $('#preview-modal')
            
            modal.on('shown.bs.modal', e => {
                const video = document.getElementById('video-player')
                if (video) {
                    video.load()
                    video.play()
                }

                self.getModalBoundingBox()

                self.setState({
                    isClose: false
                })
            })

            .on('hide.bs.modal', e => {
                const video = document.getElementById('video-player')
                const tempPreviewIframe = document.getElementById('temp-preview')
                var appPreview = document.querySelector('.playing iframe')
                if (video) video.pause()
                if (tempPreviewIframe) tempPreviewIframe.src = ''
                if (appPreview) appPreview.src = ''
                

                self.setState({
                    isClose: true
                })
                
            })
        }
    }

    componentWillReceiveProps(props) {
        const self = this
        const {selectedAsset, isIframe, isTempPreview} = props

        if (selectedAsset) {
            self.setState({
                asset: null
            })

            setTimeout(() => {
                const dimension = selectedAsset.dimension ? selectedAsset.dimension.split('*') : [1920, 1080]
                self.setState({
                    asset: selectedAsset.template_width ? selectedAsset : (selectedAsset.type == 2 ? {
                        ...selectedAsset,
                        template_width: 1920,
                        template_height: 1080
                    } : {
                        ...selectedAsset,
                        template_width: selectedAsset.width ? selectedAsset.width : dimension[0],
                        template_height: selectedAsset.height ? selectedAsset.width : dimension[1]
                    }),
                    isIframe
                })
            }, 50)
        }

        self.setState({
            isTempPreview
        })
    }

    getModalBoundingBox() {
        self = this
        const modal = $('#preview-modal .modal-dialog')

        self.setState({
            modalWidth: modal.width()
        })

        $(window).on('resize', e => {
            self.setState({
                modalWidth: modal.width()
            })
        })
    }

    render() {
        const {asset, modalWidth, isClose, isTempPreview} = this.state
        const {isIframe} = this.props

        return(
            <React.Fragment>
                <div className={`modal fade ads__modal-preview show ${(modalWidth == 0 || !asset || isClose) ? 'transparent' : ''}`} id="preview-modal">
                    <div className={`modal-dialog modal-lg ${asset ? (asset.content ? 'asset' : (asset.orientation ? 'horizontal' : 'vertical')) : ''}`}>
                        {modalWidth > 0 && (
                            <div className="modal-content"  style={asset ? {width: asset.template_width > modalWidth || asset.template_width <= 16 ? modalWidth : asset.template_width, height: (asset.template_height/asset.template_width)*(asset.template_width > modalWidth || asset.template_width <= 16 ? modalWidth : asset.template_width)} : {}}>
                                <div className="modal-body">
                                    <button className="btn-close" type="button" data-dismiss="modal">
                                        <i className="icon-close"></i>
                                    </button>
                                    {asset && (
                                        <div className="preview-container">
                                            {isTempPreview ? (
                                                <iframe id="temp-preview" src='/preview/temp' />
                                            ) : (isIframe ? (
                                                <iframe src={`/preview/${asset.id}${isClose ? '/thumbnail' : ''}`}></iframe>
                                            ) : asset.type == 0 ? (
                                                <img src={asset.content} alt={asset.name}/>
                                            ) : (asset.type == 1 ? (
                                                <video controls id="video-player">
                                                    <source src={asset.content} type={`video/${clientUtils.get_media_extension(asset.content)}`} />
                                                </video>
                                            ) : (
                                                <div className="playing" dangerouslySetInnerHTML={{__html: asset.content}}></div>
                                            )))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Preview

