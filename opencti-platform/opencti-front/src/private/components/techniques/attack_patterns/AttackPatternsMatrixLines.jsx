import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import * as R from 'ramda';
import { graphql, createRefetchContainer } from 'react-relay';
import withTheme from '@mui/styles/withTheme';
import withStyles from '@mui/styles/withStyles';
import { Link } from 'react-router-dom';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Menu from '@mui/material/Menu';
import { AddCircleOutlineOutlined, InfoOutlined } from '@mui/icons-material';
import { ListItemIcon, ListItemText } from '@mui/material';
import withRouter from '../../../../utils/compat-router/withRouter';
import inject18n from '../../../../components/i18n';
import { attackPatternsLinesQuery } from './AttackPatternsLines';
import { computeLevel } from '../../../../utils/Number';
import AttackPatternsMatrixBar from './AttackPatternsMatrixBar';
import { truncate } from '../../../../utils/String';
import { MESSAGING$ } from '../../../../relay/environment';
import { UserContext } from '../../../../utils/hooks/useAuth';

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    margin: '15px 0 -24px 0',
    overflow: 'scroll',
    whiteSpace: 'nowrap',
    paddingBottom: 20,
    minWidth: 'calc(100vw - 110px)',
    width: 'calc(100vw - 110px)',
    maxWidth: 'calc(100vw - 110px)',
    position: 'relative',
  },
  containerWithMarginRight: {
    display: 'flex',
    flexDirection: 'column',
    margin: '15px 0 -24px 0',
    overflow: 'scroll',
    whiteSpace: 'nowrap',
    paddingBottom: 20,
    minWidth: 'calc(100vw - 305px)',
    width: 'calc(100vw - 305px)',
    maxWidth: 'calc(100vw - 305px)',
    position: 'relative',
  },
  containerNavOpen: {
    display: 'flex',
    flexDirection: 'column',
    margin: '15px 0 -24px 0',
    overflow: 'scroll',
    whiteSpace: 'nowrap',
    paddingBottom: 20,
    minWidth: 'calc(100vw - 235px)',
    width: 'calc(100vw - 235px)',
    maxWidth: 'calc(100vw - 235px)',
    position: 'relative',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: theme.palette.divider,
    marginBottom: 10,
  },
  headerElement: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    width: 150,
    margin: '0 5px 0 5px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    width: 150,
    margin: '0 5px 0 5px',
  },
  element: {
    color: theme.palette.text.primary,
    padding: 10,
    width: '100%',
    whiteSpace: 'normal',
    backgroundColor: theme.palette.background.paper,
    cursor: 'pointer',
    marginBottom: 5,
  },
  name: {
    fontSize: 10,
    fontWeight: 400,
  },
});

const colors = (defaultColor) => [
  [defaultColor, 'transparent', 'rgba(255,255,255,0.1)'],
  ['#ffffff', 'rgba(255,255,255,0.2)'],
  ['#fff59d', 'rgba(255,245,157,0.2)'],
  ['#ffe082', 'rgba(255,224,130,0.2)'],
  ['#ffb300', 'rgba(255,179,0,0.2)'],
  ['#ffb74d', 'rgba(255,183,77,0.2)'],
  ['#fb8c00', 'rgba(251,140,0,0.2)'],
  ['#d95f00', 'rgba(217,95,0,0.2)'],
  ['#e64a19', 'rgba(230,74,25,0.2)'],
  ['#f44336', 'rgba(244,67,54,0.2)'],
  ['#d32f2f', 'rgba(211,47,47,0.2)'],
  ['#b71c1c', 'rgba(183,28,28,0.2)'],
];

const colorsReversed = (defaultColor) => [
  [defaultColor, 'transparent', 'rgba(255,255,255,0.1)'],
  ['#ffffff', 'rgba(255,255,255,0.2)'],
  ['#c5e1a5', 'rgba(197,225,165,0.2)'],
  ['#aed581', 'rgba(174,213,129,0.2)'],
  ['#9ccc65', 'rgba(156,204,101,0.2)'],
  ['#8bc34a', 'rgba(139,195,74,0.2)'],
  ['#66bb6a', 'rgba(102,187,106,0.2)'],
  ['#4caf50', 'rgba(76,175,80,0.2)'],
  ['#43a047', 'rgba(67,160,71,0.2)'],
  ['#388e3c', 'rgba(56,142,60,0.2)'],
  ['#2e7d32', 'rgba(46,125,50,0.2)'],
  ['#1b5e20', 'rgba(27,94,32,0.2)'],
];

class AttackPatternsMatrixLinesComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: {},
      anchorEl: null,
      menuElement: null,
    };
  }

  componentDidMount() {
    this.subscription = MESSAGING$.toggleNav.subscribe({
      next: () => this.setState({ navOpen: localStorage.getItem('navOpen') === 'true' }),
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  handleOpen(element, event) {
    this.setState({ anchorEl: event.currentTarget, menuElement: element });
  }

  handleClose() {
    this.setState({ anchorEl: null, menuElement: null });
  }

  localHandleAdd(element) {
    this.handleClose();
    this.props.handleAdd(element);
  }

  handleToggleHover(elementId) {
    const { hover } = this.state;
    hover[elementId] = hover[elementId] !== true;
    this.setState({ hover });
  }

  level(attackPattern) {
    const { attackPatterns } = this.props;
    const numberOfCorrespondingAttackPatterns = R.filter(
      (n) => n.id === attackPattern.id
                || (attackPattern.subAttackPatternsIds
                    && R.includes(n.id, attackPattern.subAttackPatternsIds)),
      attackPatterns,
    ).length;
    return computeLevel(
      numberOfCorrespondingAttackPatterns,
      0,
      10,
    );
  }

  render() {
    const {
      t,
      data,
      classes,
      theme,
      attackPatterns: selectedPatterns,
      searchTerm,
      handleToggleColorsReversed,
      currentColorsReversed,
    } = this.props;
    const { hover, menuElement } = this.state;

    const filterByKeyword = (n) => searchTerm === ''
            || n.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
            || n.description?.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
            || R.propOr('', 'x_mitre_id', n)
              .toLowerCase()
              .indexOf(searchTerm.toLowerCase()) !== -1
            || R.propOr('', 'subattackPatterns_text', n)
              .toLowerCase()
              .indexOf(searchTerm.toLowerCase()) !== -1;

    const attackPatterns = R.pipe(
      R.map((n) => ({
        ...n.node,
        subAttackPatternsIds: R.map(
          (o) => o.node.id,
          n.node.subAttackPatterns.edges,
        ),
        level: this.level(n.node),
      })),
      R.filter(filterByKeyword),
    )(data.attackPatterns.edges);

    return (
      <UserContext.Consumer>
        {() => (
          <div
            className={classes.container}
            style={{ height: 'calc(100vh - 310px)' }}
          >
            <div
              id="container"
              style={{ width: '100%' }}
            >
              {attackPatterns.map((a) => {
                const isHover = hover[a.id] === true;
                const level = isHover && a.level !== 0 ? a.level - 1 : a.level;
                const position = isHover && level === 0 ? 2 : 1;
                const killChainNames = a.killChainPhases.map((phase) => phase.kill_chain_name).join(', ');
                const phaseName = a.killChainPhases.length > 0 ? a.killChainPhases[0].phase_name : '';

                return (
                  <div key={a.id} className={classes.header}>
                    <div className={classes.headerElement}>
                      <div className={classes.title}>
                        {truncate(killChainNames, 18)}
                      </div>
                      <div className={classes.name}>
                        {phaseName }
                      </div>
                    </div>
                    <div
                      className={classes.element}
                      style={{
                        border: `1px solid ${
                          currentColorsReversed
                            ? colorsReversed(theme.palette.background.accent)[level][0]
                            : colors(theme.palette.background.accent)[level][0]
                        }`,
                        backgroundColor: currentColorsReversed
                          ? colorsReversed(theme.palette.background.accent)[level][position]
                          : colors(theme.palette.background.accent)[level][position],
                      }}
                      onMouseEnter={() => this.handleToggleHover(a.id)}
                      onMouseLeave={() => this.handleToggleHover(a.id)}
                      onClick={(event) => this.handleOpen(a, event)}
                    >
                      <div className={classes.name}>{a.name}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Menu
              anchorEl={this.state.anchorEl}
              open={Boolean(this.state.anchorEl)}
              onClose={this.handleClose.bind(this)}
              disableAutoFocusitem
            >
              <MenuItem
                component={Link}
                to={`/dashboard/techniques/attack_patterns/${menuElement?.id}`}
                target="_blank"
              >
                <ListItemIcon>
                  <InfoOutlined fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('View')}</ListItemText>
              </MenuItem>
              {this.props.handleAdd && (
              <MenuItem
                onClick={this.localHandleAdd.bind(this, menuElement)}
              >
                <ListItemIcon>
                  <AddCircleOutlineOutlined fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('Add')}</ListItemText>
              </MenuItem>
              )}
            </Menu>
          </div>
        )}
      </UserContext.Consumer>
    );
  }
}

AttackPatternsMatrixLinesComponent.propTypes = {
  data: PropTypes.object,
  classes: PropTypes.object,
  theme: PropTypes.object,
  t: PropTypes.func,
  fld: PropTypes.func,
  attackPatterns: PropTypes.array,
  marginRight: PropTypes.bool,
  searchTerm: PropTypes.string,
  handleToggleColorsReversed: PropTypes.func,
  currentColorsReversed: PropTypes.bool,
  hideBar: PropTypes.bool,
  handleAdd: PropTypes.func,
};

export const attackPatternsMatrixLinesQuery = graphql`
    query AttackPatternsMatrixLinesQuery(
        $orderBy: AttackPatternsOrdering
        $orderMode: OrderingMode
        $count: Int!
        $cursor: ID
        $filters: FilterGroup
    ) {
        ...AttackPatternsMatrixLines_data
        @arguments(
            orderBy: $orderBy
            orderMode: $orderMode
            count: $count
            cursor: $cursor
            filters: $filters
        )
    }
`;

const AttackPatternsMatrixLines = createRefetchContainer(
  AttackPatternsMatrixLinesComponent,
  {
    data: graphql`
            fragment AttackPatternsMatrixLines_data on Query
            @argumentDefinitions(
                orderBy: { type: "AttackPatternsOrdering", defaultValue: x_mitre_id }
                orderMode: { type: "OrderingMode", defaultValue: asc }
                count: { type: "Int", defaultValue: 25 }
                cursor: { type: "ID" }
                filters: { type: "FilterGroup" }
            ) {
                attackPatterns(
                    orderBy: $orderBy
                    orderMode: $orderMode
                    first: $count
                    after: $cursor
                    filters: $filters
                ) {
                    edges {
                        node {
                            id
                            entity_type
                            parent_types
                            name
                            description
                            isSubAttackPattern
                            x_mitre_id
                            subAttackPatterns {
                                edges {
                                    node {
                                        id
                                        name
                                        description
                                        x_mitre_id
                                    }
                                }
                            }
                            killChainPhases {
                                id
                                kill_chain_name
                                phase_name
                                x_opencti_order
                            }
                        }
                    }
                }
            }
        `,
  },
  attackPatternsLinesQuery,
);

export default R.compose(
  inject18n,
  withTheme,
  withRouter,
  withStyles(styles),
)(AttackPatternsMatrixLines);
