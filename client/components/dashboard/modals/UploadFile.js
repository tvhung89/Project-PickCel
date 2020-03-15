import React, {Component} from 'react'
import swal from 'sweetalert'
import clientUtils from '../../../utils'

class UploadFile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            files: [],
            isUploadFail: false,
            selectedFile: null,
            isEditing: false
        }   
    }

    componentDidMount() {
        const self = this
        const user_id = clientUtils.get_user_id()
        let count = 0
        if (window.jQuery) {
            const form = $('#fileuploader').uploadFile({
                url: '/api/upload',
                fileName: 'assets',
                formData: {
                    user_id
                },
                dynamicFormData: function()
                {
                    var files = [...self.state.files]
                    return {
                        files
                    }        
                },
                sequential:true,
                multiple: true,
                sequentialCount:1,
                autoSubmit: false,
                showProgress: true,
                onSelect: files => {
                    const regPattern = new RegExp('image\/|video\/')
                    const invalidFiles = Array.from(files).filter(f => !regPattern.test(f.type))
                    const isMaxFileSize = Array.from(files).filter(f => f.size > 1000000000)

                    if (invalidFiles.length > 0) {
                        swal({
                            text: "The file(s) is not valid Image/Video!",
                            icon: "warning",
                            dangerMode: true,
                        })
                        return false
                    } else {
                        if (isMaxFileSize.length > 0) {
                            swal({
                                text: "Max file for image/video size is 1GB. Please try again!",
                                icon: "warning",
                                dangerMode: true,
                            })
                            return false
                        }
                        if (files && files.length > 0) {
                            Array.from(files).forEach((file, index) => {
                                const reader = new FileReader();
                                reader.onloadend = function () {
                                    if (reader.result && reader.result.indexOf('data:image') > -1) {
                                        const img = new Image();
                                        img.onload = function () {
                                            const width = img.naturalWidth || img.width;
                                            const height = img.naturalHeight || img.height;
                                            const fileNames = file.name.split('.')

                                            self.setState({
                                                files: [...self.state.files, {
                                                    name: fileNames[0],
                                                    extension: fileNames[1],
                                                    type: 0,
                                                    width,
                                                    height,
                                                    size: file.size,
                                                    user_id
                                                }]
                                            })
                                        }
                                        img.src = reader.result
                                    } else {
                                        const v = document.createElement("video");
                                        const fileNames = file.name.split('.')
                                        v.addEventListener("loadedmetadata", function (e) {
                                            self.setState({
                                                files: [...self.state.files, {
                                                    name: fileNames[0],
                                                    extension: fileNames[1],
                                                    type: 1,
                                                    width: this.videoWidth,
                                                    height: this.videoHeight,
                                                    duration: Math.round(v.duration),
                                                    size: file.size,
                                                    user_id
                                                }]
                                            })
                                        }, false);
                                        v.src = reader.result;
                                    }

                                }
                                reader.readAsDataURL(file)
                            })

                            setTimeout(() => {
                                $('.ajax-file-upload-filename').each(function() {
                                    const filename = $(this).text().split(' (')
                                    let file = Array.from(files).find(f => f.name == filename[0])
                                    file = file.type ? file.type.indexOf('image') > -1 : false

                                    if (file) $(this).prepend('<div class="left"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAA8CAYAAAD2ZeOZAAAABHNCSVQICAgIfAhkiAAAA3hJREFUaIHtmk9oHFUYwH/fe5Nk1267aYnZQgv9Jw2RQEPFQw3EUlGxIHgSilCsEESPOVR686AWivQg6MEeDNGzJxUt0saL8Q/EWgpirdEKgXQPa5Zs2ezuzHs9vGbtambdCe7MVuZ3G773vfl9b96bP48R7mLneMbCG8B+YJAYqVRVsHirf2r8xbUPouQpa9HBHG9Z+BQ4TMziAAjawoUrM5lTUdIUXzEpcAaQLql1SuQClLW81k2jiEQqQAHjXRaKSscFKIRCHEYR6agAFZfNJtAWLvwwk3khrEEvywNohJmwAnpCvt+z4UGLF1ZAz8h7KnoBPSEPsD0XtG+wQQE9I18Y9MllTPtGfytAzBxtrlf8lCqatbpQrYePqwXfU/UxL0avjtjxb9PH4RnY3zPTZjOk8kmRyidFKp8UqXxSpPJJESrvTzTwJxqYvWfj9InE/3Pk7wc6fiX2JxrQKIL/J2RHoHYTtfw+Zvdp0Hmo3UTfeBVZuYjZfRozfNK1A6j+jF6cdrGH3sMMPe9y7kEtvQ3VXzC7pl2erSGVBfTVyVCnaCPfN9yUYWAPZs+bUF92Ra0fA3bwCcjsRVbnXdvsSDNmClOgMkj5ksu725+sXMbsOwfZEWR1Hrn9E3brEYKxL/4jecBbGEMvTrccq+Ksk+7bDoC+9jTe1zn01UnU0vlmzA4+Bbb2T4nKAnboOXc1gjKYKgQlsDVs7pFwl6jyALJysW3cFF7C7nwFu2UUZKAlTxVnMYUpbP6Ymxqr86jrJ/8aYZ13sWZl4efpymeg2XcOdB6pXIGg1CJjtk1Co4j33a6WHKksuHYbxMLozjfs+mIMStjMgdZY/07QeYJD37upEdxGSp+gfj/jFnnfMP7ha4hfwj7wMFL9Df3joxuepiu3SilfAsBum0DWfnWLdp36sovlxrH5Y9gdz2IOvAOAvn6qucDt1iNgakj5y/DzxLn1YQ7OYh484e4u9SUAN1WCMt43Q9H6guOxbn1I8SMkO4rdMoq95xmwfreK3F+vbTp1ioHj9/XrQSqfFKl8UqTySZHKJ0UqnxSpfFKk8kmRyieFwvJt0hKbwTcsKlF8mLRIZCy3BjL8oeRx3gXC9xd6DyPCCXmMqgJQR3lShJeBGwmLtWMN+Fj6OChHuQwb/AhqP2OALNnY1dqRxfA5FXmdlh9y7gAbszjWrPkBiAAAAABJRU5ErkJggg==" alt="Image Thumbnail"></div>')
                                    else $(this).prepend('<div class="left"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAA8CAYAAAD2ZeOZAAAABHNCSVQICAgIfAhkiAAAA9VJREFUaIHtml1oW1UcwH//0zTN7NKWStVMWUsttcqcUWrxpSKIWGVM8GEwFIdgEaSv4vYg+CDik08dPrTg15ugD4XJOpT6MqidsFo/2Eop61ZSW7e4Ns3aXNN7fDhpa8y916TQnAj393LC+Z+b/P7nKyeHCAUeHc+/oLT7vkAn0EIVcTeyW7mbC4NXB5OfVPKc4ktdlxzPfaC0e07gCaosDoBQF3H1yEMj069X8ph6rCn/NFrOCMh+uZXFHhJQaPed/XSqiAoTUIgk99upIipIQAncWw2niigzAVUtn4rZTuDjy6/4NaldeTAJKD71S6Am5CUSDQgS8UugRuTrQUUCGngnUBPyAKqxObiBRwK1I9/chjQ0Bjf6VwKSPO/oasiVi5u9jXY20c5mQCud/0vVHwmYaHZQjS3wHwMARMR1O2tm2uyFUN4WobwtQnlbhPK2COVt4Xm2Od8vtEZhKg1Dl7VnbPx3TXZLePl+mFmFN34sPd9NPWtuU/q+25+zn2fP/7xqykeaiutP9xhxx4VzS3B34QdQk6Xjnaf8V4umpw5G4FT7bv2RJlN/LauZTMPbM5qzc5oTk3ZO1Z59NpmG2YymOy70twmfLRi5jkYpxAXQDD8u9LXCk61mep1qh5OHzegseRzHh7qEYwlojcJ6Hi7e1Lz7a2nMcU0HDc8ZFz98F+wva0a0s3C2Pt0jRJX50OG50p5+qhUGO434bEaT2yqOHz8kvNZuRnMqDZk8PH+fMNQlRbGZVbjlQHdcOPNw8A2kr/yHVzTr+d2psz1lflvzbv/MPSa5tAOvTlEylY4fMuUtx5R/5LaT1juxKxmz8F+6aJ5NxEzSfgQutfksHG2G/jahozACF5a92z5wwJQ51zve1sCOUCK2Wx9VQrzevN78x2gtbZp2h+/y9wuUH0sZ+Z44RBVcy8JYyntxLm5AX8B73bhjZLy21dFeIRGDWN1u3XaC1+/sWV7z1oNmHgNczfjvKt+vaI4ljMRor5RsnxeWIdliOmO0V4gpTUejMLGiizpptFd2Rimos6CMb9hLafOw47KzM3gxmYaJFY3jGpG1fPGOM5bSjMxr0o6Jd8eF1AZc+lMYS2k+XzCbwdFm8/0xm9F8NBu8Bdfc1Ue5bLnui//rs00ob4tQ3hahvC1CeVuE8rYI5W0RytsilLdFKG8LpeEH2xJ7QYR5JfCFbZFK0bCczjRcV9MD0bPAt7aFykVrXJCTiydkQwFMD0SfQ3gT9JxtOT80bGr011u6vvungfoJ8PgjaNc3uuFg7vaB6uv5s97Q4s5Nsc57UnQT+jeB9Ve1RUHKGgAAAABJRU5ErkJggg==" alt="Video Thumbnail"></div>')
                                })
                            }, 100)
                        }
                        $('.ajax-upload-dragdrop').addClass('d-none');
                        
                        return true
                    }
                    
                },
                onCancel: (files, pd) => {
                    if ($('.ajax-file-upload-statusbar').length == 0) $('.ajax-upload-dragdrop').removeClass('d-none');
                },
                showFileCounter:false,
                customProgressBar: function(obj,s)
                {
                    this.statusbar = $("<div class='ajax-file-upload-statusbar'></div>");
                    this.preview = $("<img class='ajax-file-upload-preview' />").width(s.previewWidth).height(s.previewHeight).appendTo(this.statusbar).hide();
                    this.filename = $(`<div class='ajax-file-upload-filename' id='filename${++count}'></div>`).appendTo(this.statusbar);
                    this.progressDiv = $("<div class='ajax-file-upload-progress progress'>").appendTo(this.statusbar).hide();
                    this.progressbar = $("<div class='ajax-file-upload-bar progress-bar progress-bar-striped'></div>").appendTo(this.progressDiv);
                    this.abort = $("<div>" + s.abortStr + "</div>").appendTo(this.statusbar).hide();
                    this.cancel = $("<i class='icon-trash'></i>").appendTo(this.statusbar).hide();
                    this.done = $("<div>" + s.doneStr + "</div>").appendTo(this.statusbar).hide();
                    this.download = $("<div>" + s.downloadStr + "</div>").appendTo(this.statusbar).hide();
                    this.del = $("<i class='icon-pencil'></i>").appendTo(this.statusbar).on('click', function(e) {
                        e.preventDefault()
                        
                        const $this = $(this)
                        const parent = $this.parent()
                        const files = self.state.files
                        const fileName = parent.find('.ajax-file-upload-filename').text()
                        const box = parent.find('.name-box-wrapper')
                        const input = box.find('.name-box .form-control')

                        const selectedFile = files.filter(f => fileName.indexOf(f.name) >= 0)
                        if (selectedFile && selectedFile.length > 0) {
                            self.setState({
                                selectedFile: selectedFile[0],
                                isEditing: true
                            })
                            box.show().find('.name-box .form-control').val(selectedFile[0].name)

                            input.focus()

                            input.on('blur', function(e) {
                                e.preventDefault()
                                const $this = $(this)

                                setTimeout(() => {
                                    self.setState({
                                        isEditing: false
                                    })
                                    $this.val(selectedFile.name).parents('.name-box-wrapper').hide()
                                }, 100)
                            })

                            input.keyup(function(e) {
                                e.preventDefault()
                                const $this = $(this)

                                if (e.which === 13) {
                                    self.handleChangeName($this, $this.val())
                                }

                                if (e.which === 27) {
                                    self.setState({
                                        isEditing: false
                                    })
                                    $this.val(selectedFile.name).parents('.name-box-wrapper').hide()
                                }
                            })
                        }

                        return false
                    });

                    $(`<div class='name-box-wrapper'>
                            <div class='name-box'>
                                <input type='text' class='form-control' maxlength="50">
                                <i class='icon-check'></i>
                                <i class='icon-close'></i>
                            </div>
                        </div>`).appendTo(this.statusbar).on('click', '.name-box .icon-check', function(e) {
                            const $this = $(this)
                            const input = $this.parent().find('.form-control')

                            self.handleChangeName($this, input.val())
                        }).on('click', '.name-box .icon-close', function(e) {
                            const $this = $(this)
                            const parent = $this.parents('.name-box-wrapper')
                            const {selectedFile} = self.state
                            
                            self.setState({
                                isEditing: false
                            })

                            parent.hide().find('.name-box .form-control').val(selectedFile.name)
                        }).hide()
                    
                    this.abort.addClass("custom-red");
                    this.done.addClass("custom-green");
                    this.download.addClass("custom-green");            
                    this.cancel.addClass("custom-red");
                    this.del.addClass("custom-red");

                    this.statusbar.addClass(`order${count}`)

                    return this;
                    
                },
                afterUploadAll: obj => {
                    if (self.state.isUploadFail) {
                        swal({
                            text: "Can't upload assets!",
                            icon: "error",
                            dangerMode: true
                        })
                    } else {
                        swal({
                            text: "Assets have been uploaded!",
                            icon: "info",
                        })
                    }
                    
                    $('#upload-modal').modal('hide')
                    form.reset()
                    $('.ajax-upload-dragdrop').removeClass('d-none');

                    self.props.getAsset(user_id)
                },
                onSuccess: (files, data, xhr, pd) => {
                    if (!data.success) {
                        self.setState({
                            isUploadFail: true
                        })
                    }
                }
            })

            $('#upload-btn').click(() => {
                $('.ajax-file-upload-statusbar .icon-pencil').hide()
                form.startUpload()
            })

            // Init scrollbar
            jQuery('.ajax-file-upload-container').addClass('scrollbar-outer').scrollbar()
        }
    }

    handleChangeName = (context, value) => {
        const self = this
        const {selectedFile} = self.state
        const parent = context.parents('.name-box-wrapper')
        const fileNameTxt = context.parents('.ajax-file-upload-statusbar').find('.ajax-file-upload-filename')

        fileNameTxt.text(fileNameTxt.text().replace(selectedFile.name, value))

        self.setState({
            ...self.state,
            files: [
                ...self.state.files.map(f => {
                    if (f.name === selectedFile.name) return {
                        ...f,
                        name: value
                    }
                    return f
                })
            ],
            isEditing: false
        })

        parent.hide()
    }

    render() {
        const {isEditing} = this.state

        return(
            <div className="modal fade ads__upload ads__display-add show" id="upload-modal" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">Upload asset(s)</h3><a href="#" data-dismiss="modal"><i className="icon-close"></i></a>
                        </div>
                        <div className="modal-body left">
                            <div id="fileuploader">Upload</div>
                        </div>
                        <div className="modal-footer">
                            <button className={`btn btn-success rounded ${isEditing ? 'disabled' : ''}`} type="button" onClick={e => {
                                $("input[name='assets[]']").trigger('click')
                            }}>Add files</button>
                            <button className={`btn btn-primary rounded ${isEditing ? 'disabled' : ''}`} type="submit" id="upload-btn">Upload</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UploadFile

