import React, {Component} from 'react'

class Tags extends Component {

    constructor(props) {
        super(props)

        this.state = {
            filterTags: []
        }
    }

    componentDidMount() {
        this.props.onInit()
    }

    handleClose = e => {
        e.preventDefault();
        this.props.onFilterClose()
        return false;
    }

    handleClear = e => {
        e.preventDefault()
        this.setState({
            filterTags: []
        })

        this.props.onFilter([])
        return false;
    }

    handleFilter(e, key, value) {
        const self = this;
        const isChecked = e.target.checked;
        const { filterTags } = self.state
        const isExist = filterTags.find(t => t.key === key && t.value === value)
        const newFilterTags = isChecked ? (isExist ? filterTags.map(t => {
            if (t.key === key && t.value === value) return {
                key,
                value
            }
            return t;
        }) : [...filterTags, {key, value}]) : filterTags.filter(t => !(t.key === key && t.value === value))

        self.setState({
            filterTags: newFilterTags
        })

        self.props.onFilter(newFilterTags)
    }

    componentWillUnmount() {
        this.props.onFilter([])
    }

    render() {
        const {filterTags} = this.state
        const {assetTags, displayTags} = this.props
        const assetTagsMarkup = assetTags?Object.keys(assetTags).map(t => {
            const valueTag = []
            return (
                <ul key={t}>
                    <li>{t}</li>
                    {assetTags[t] && assetTags[t].length > 0 && assetTags[t].map(aT => {
                       if(!valueTag.includes(aT.value)){
                        valueTag.push(aT.value)
                        return (
                            <li key={aT.id}>
                                <div className="checkbox">
                                    <input id={aT.id} type="checkbox" checked={filterTags.find(f => f.key === t && f.value === aT.value)} onChange={e => this.handleFilter(e, t, aT.value)}/>
                                    <label htmlFor={aT.id}>{aT.value}</label>
                                </div>
                            </li>
                        )
                       }
                    })}
                </ul>
            )
        }): ''


        const displayTagsMarkup = displayTags?Object.keys(displayTags).map(t => {
            const valueTag = []
            return (
                <ul key={t}>
                    <li>{t}</li>
                    {displayTags[t] && displayTags[t].length > 0 && displayTags[t].map(aT => {
                       if(!valueTag.includes(aT.value)){
                        valueTag.push(aT.value)
                        return (
                            <li key={aT.id}>
                                <div className="checkbox">
                                    <input id={aT.id} type="checkbox" checked={filterTags.find(f => f.key === t && f.value === aT.value)} onChange={e => this.handleFilter(e, t, aT.value)}/>
                                    <label htmlFor={aT.id}>{aT.value}</label>
                                </div>
                            </li>
                        )
                       }
                    })}
                </ul>
            )
        }):''

        return(
            <div className="ads__tags-container">
                <div className="ads__tags-container-header">
                    <p>Filter assets by tags</p>
                    <div className="group-links">
                        <a href="#" onClick={this.handleClear}>
                            <i className="icon-eraser"></i>
                        </a>
                        <a href="#" onClick={this.handleClose}>
                            <i className="icon-close"></i>
                        </a>
                    </div>
                </div>
                <div className="ads__tags-container-list">
                   {assetTags?assetTagsMarkup:(displayTags?displayTagsMarkup:'')}
                </div>
            </div>
        )
    }
}

export default Tags
