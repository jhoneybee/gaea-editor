import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as typings from './tab-tools-components-custom.type'

import * as EditorManager from '../../../gaea-editor-manager/gaea-editor-manager'

import {autoBindMethod} from '../../../../../common/auto-bind/index'

import './tab-tools-components-custom.scss'

@EditorManager.observer(['application'])
export default class TabToolsComponentsCommon extends React.Component<typings.PropsDefine, typings.StateDefine> {
    static defaultProps: typings.PropsDefine = new typings.Props()
    public state: typings.StateDefine = new typings.State()

    static position = 'tabToolsComponentsCustom'

    @EditorManager.lazyInject(EditorManager.ViewportAction) private viewportAction: EditorManager.ViewportAction

    componentDidMount() {
        this.viewportAction.registerOuterDarg(ReactDOM.findDOMNode(this) as HTMLElement)
    }

    render() {
        const CommonDraggableItems = this.props.application.customComponents.map((ComponentClass, index) => {
            return (
                <div key={index}
                     data-unique-key={ComponentClass.defaultProps.gaeaUniqueKey}
                     className="component-draggable-item">
                    {ComponentClass.defaultProps.gaeaName}
                </div>
            )
        })

        return (
            <div className="_namespace">
                {CommonDraggableItems}
            </div>
        )
    }
}