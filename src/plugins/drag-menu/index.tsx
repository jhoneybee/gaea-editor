import { Connect } from 'dob-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Icon from '../../components/icon/src';
import * as Styled from './index.style';
import { Props, State } from './index.type';

@Connect
class DragMenu extends React.Component<Props, State> {
  public static defaultProps = new Props();

  public state = new State();

  private listContainer: Map<string, React.ReactInstance> = new Map();

  public componentDidMount() {
    this.listContainer.forEach(value => {
      this.props.actions.ViewportAction.registerOuterDrag(value as HTMLElement);
    });
  }

  public render() {
    return (
      <Styled.Container>
        <Styled.Title>
          <div>{this.props.stores.ApplicationStore.setLocale('拖拽组件', 'Drag Component')}</div>
          <Styled.CloseContainer onClick={this.handleCloseLeftBar}>
            <Icon type="close" size={15} />
          </Styled.CloseContainer>
        </Styled.Title>

        <Styled.SearchInput
          value={this.state.searchContent}
          onChange={this.handleSearch}
          placeholder={this.props.stores.ApplicationStore.setLocale('搜索..', 'Search..')}
        />
        {this.renderList('基本组件', 'General', this.getList())}
        {this.renderList('Form 组件', 'Form', this.getList())}
        {this.renderList('Layout 布局组件', 'Layout', this.getList())}
        {this.props.actions.ApplicationAction.loadPluginByPosition('toolContainerDragMenuList')}
      </Styled.Container>
    );
  }

  private renderList = (title: string, group: string, dom: React.ReactNode) => {
    if (Array.isArray(dom) && dom.length > 0) {
      return (
        <Styled.GroupListContainer>
          <p> {title} </p>
          <Styled.ListContainer
            ref={(ref: React.ReactInstance) => {
              this.listContainer.set(group, ref);
            }}
          >
            {this.getList().filter(element => element.props['data-gaea-group'] === group)}
          </Styled.ListContainer>
        </Styled.GroupListContainer>
      );
    }
    return null;
  };

  private getList = () => {
    return Array.from(this.props.stores.ApplicationStore.componentClasses)
      .filter(([gaeaKey, componentClass]) => {
        const setting = this.props.stores.ApplicationStore.componentSetting.get(gaeaKey);

        // 如果被设置为了预设组件，过滤掉
        if (
          Array.from(this.props.stores.ApplicationStore.preComponents.keys()).some(
            preGaeaKey => preGaeaKey === setting.key,
          )
        ) {
          return false;
        }

        // 过滤主容器
        if (gaeaKey === 'gaea-container') {
          return false;
        }

        // 如果搜索框没有输入，展示
        if (this.state.searchContent === '') {
          return true;
        }

        return new RegExp(this.state.searchContent).test(setting.name);
      })
      .map(([gaeaKey, componentClass], index) => {
        const setting = this.props.stores.ApplicationStore.componentSetting.get(gaeaKey);

        return (
          <Styled.Component
            key={`standard${index}`}
            data-gaea-group={setting.group}
            data-gaea-key={setting.key}
            className="gaea-component-drag-menu"
          >
            {setting.name}
          </Styled.Component>
        );
      })
      .concat(Array.from(this.props.stores.ApplicationStore.preComponents).map(
        ([gaeaKey, preComponentInfos], index) => {
          const componentClass = this.props.stores.ApplicationStore.componentClasses.get(gaeaKey);
          return Array.prototype.concat.apply(
            [],
            preComponentInfos
              .filter(preComponentInfo => {
                const setting = this.props.stores.ApplicationStore.componentSetting.get(gaeaKey);

                // 如果搜索框没有输入，展示
                if (this.state.searchContent === '') {
                  return true;
                }

                return new RegExp(this.state.searchContent).test(setting.name);
              })
              .map((preComponentInfo, childIndex) => {
                const setting = this.props.stores.ApplicationStore.componentSetting.get(gaeaKey);

                return (
                  <Styled.Component
                    className="gaea-component-drag-menu"
                    key={`preSetting${index}&${childIndex}`}
                    data-gaea-key={componentClass.defaultProps.editSetting.key}
                    data-props={JSON.stringify(preComponentInfo.props)}
                    data-pre-gaea-key={gaeaKey}
                  >
                    {preComponentInfo.name}
                  </Styled.Component>
                );
              }),
          );
        },
      ) as any);
  };

  private handleCloseLeftBar = () => {
    this.props.actions.ApplicationAction.setLeftTool(null);
    this.props.actions.ApplicationAction.setRightTool(null);
  };

  private handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      searchContent: event.currentTarget.value as string,
    });
  };
}

export default {
  position: 'toolContainerLeftDragMenu',
  class: DragMenu,
};
