// Libraries
import React from 'react';
import _ from 'lodash';
import { LocationUpdate } from '@grafana/runtime';
import { Icon, IconName, IconButton } from '@grafana/ui';
import { e2e } from '@grafana/e2e';
import { connect, MapDispatchToProps } from 'react-redux';
// Utils
import config from 'app/core/config';
import store from 'app/core/store';
// Store
import { store as reduxStore } from 'app/store/store';
import { updateLocation } from 'app/core/actions';
import { addPanel } from 'app/features/dashboard/state/reducers';
// Types
import { DashboardModel, PanelModel } from '../../state';
import { LS_PANEL_COPY_KEY } from 'app/core/constants';

export type PanelPluginInfo = { id: any; defaults: { gridPos: { w: any; h: any }; title: any } };

export interface OwnProps {
  panel: PanelModel;
  dashboard: DashboardModel;
}

export interface DispatchProps {
  addPanel: typeof addPanel;
}

export type Props = OwnProps & DispatchProps;

export interface State {
  copiedPanelPlugins: any[];
}

export class AddPanelWidgetUnconnected extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleCloseAddPanel = this.handleCloseAddPanel.bind(this);

    this.state = {
      copiedPanelPlugins: this.getCopiedPanelPlugins(),
    };
  }

  getCopiedPanelPlugins() {
    const panels = _.chain(config.panels)
      .filter({ hideFromList: false })
      .map(item => item)
      .value();
    const copiedPanels = [];

    const copiedPanelJson = store.get(LS_PANEL_COPY_KEY);
    if (copiedPanelJson) {
      const copiedPanel = JSON.parse(copiedPanelJson);
      const pluginInfo: any = _.find(panels, { id: copiedPanel.type });
      if (pluginInfo) {
        const pluginCopy = _.cloneDeep(pluginInfo);
        pluginCopy.name = copiedPanel.title;
        pluginCopy.sort = -1;
        pluginCopy.defaults = copiedPanel;
        copiedPanels.push(pluginCopy);
      }
    }

    return _.sortBy(copiedPanels, 'sort');
  }

  handleCloseAddPanel(evt: any) {
    evt.preventDefault();
    this.props.dashboard.removePanel(this.props.panel);
  }

  onCreateNewPanel = (tab = 'queries') => {
    const dashboard = this.props.dashboard;
    const { gridPos } = this.props.panel;

    const newPanel: any = {
      type: 'graph',
      title: 'Panel Title',
      gridPos: { x: gridPos.x, y: gridPos.y, w: gridPos.w, h: gridPos.h },
    };

    dashboard.addPanel(newPanel);
    dashboard.removePanel(this.props.panel);

    const location: LocationUpdate = {
      query: {
        editPanel: newPanel.id,
      },
      partial: true,
    };

    if (tab === 'visualize') {
      location.query.tab = 'visualize';
    }

    reduxStore.dispatch(updateLocation(location));
  };

  onPasteCopiedPanel = (panelPluginInfo: PanelPluginInfo) => {
    const dashboard = this.props.dashboard;
    const { gridPos } = this.props.panel;

    const newPanel: any = {
      type: panelPluginInfo.id,
      title: 'Panel Title',
      gridPos: {
        x: gridPos.x,
        y: gridPos.y,
        w: panelPluginInfo.defaults.gridPos.w,
        h: panelPluginInfo.defaults.gridPos.h,
      },
    };

    // apply panel template / defaults
    if (panelPluginInfo.defaults) {
      _.defaults(newPanel, panelPluginInfo.defaults);
      newPanel.title = panelPluginInfo.defaults.title;
      store.delete(LS_PANEL_COPY_KEY);
    }

    dashboard.addPanel(newPanel);
    dashboard.removePanel(this.props.panel);
  };

  onCreateNewRow = () => {
    const dashboard = this.props.dashboard;

    const newRow: any = {
      type: 'row',
      title: 'Row title',
      gridPos: { x: 0, y: 0 },
    };

    dashboard.addPanel(newRow);
    dashboard.removePanel(this.props.panel);
  };

  renderOptionLink = (icon: IconName, text: string, onClick: any) => {
    return (
      <div>
        <a
          href="#"
          onClick={onClick}
          className="add-panel-widget__link btn btn-inverse"
          aria-label={e2e.pages.AddDashboard.selectors.ctaButtons(text)}
        >
          <div className="add-panel-widget__icon">
            <Icon name={icon} size="xl" />
          </div>
          <span>{text}</span>
        </a>
      </div>
    );
  };

  render() {
    const { copiedPanelPlugins } = this.state;

    return (
      <div className="panel-container add-panel-widget-container">
        <div className="add-panel-widget">
          <div className="add-panel-widget__header grid-drag-handle">
            <Icon name="panel-add" type="mono" size="xl" style={{ margin: '4px', marginRight: '8px' }} />
            <span className="add-panel-widget__title">New Panel</span>
            <div className="flex-grow-1"></div>
            <IconButton
              name="times"
              onClick={this.handleCloseAddPanel}
              surface="header"
              className="add-panel-widget__close"
            />
          </div>
          <div className="add-panel-widget__btn-container">
            <div className="add-panel-widget__create">
              {this.renderOptionLink('database', 'Add Query', this.onCreateNewPanel)}
              {this.renderOptionLink('chart-line', 'Choose Visualization', () => this.onCreateNewPanel('visualize'))}
            </div>
            <div className="add-panel-widget__actions">
              <button className="btn btn-inverse add-panel-widget__action" onClick={this.onCreateNewRow}>
                Convert to row
              </button>
              {copiedPanelPlugins.length === 1 && (
                <button
                  className="btn btn-inverse add-panel-widget__action"
                  onClick={() => this.onPasteCopiedPanel(copiedPanelPlugins[0])}
                >
                  Paste copied panel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = { addPanel };

export const AddPanelWidget = connect(null, mapDispatchToProps)(AddPanelWidgetUnconnected);
