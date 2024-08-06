import React, { CSSProperties, FunctionComponent, useEffect, useState } from 'react';
import { createRefetchContainer, graphql } from 'react-relay';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { Link } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import StixCoreObjectLabels from '@components/common/stix_core_objects/StixCoreObjectLabels';
import { Theme } from '@mui/material/styles/createTheme';
import { attackPatternsLinesQuery } from './AttackPatternsLines';
import { emptyFilled, truncate } from '../../../../utils/String';
import { MESSAGING$ } from '../../../../relay/environment';
import { DataColumns } from '../../../../components/list_lines';
import ItemIcon from '../../../../components/ItemIcon';
import { HandleAddFilter } from '../../../../utils/hooks/useLocalStorage';
import ItemMarkings from '../../../../components/ItemMarkings';

const useStyles = makeStyles<Theme>((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    margin: '15px 0 -24px 0',
    overflow: 'scroll',
    whiteSpace: 'nowrap',
    paddingBottom: 20,
    position: 'relative',
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '0 10px',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: theme.palette.divider,
    marginBottom: 10,
  },
}));

interface AttackPattern {
  id: string;
  name: string;
  description?: string;
  x_mitre_id: string;
  objectMarking: {
    id: string;
    definition_type: string;
    definition: string;
    x_opencti_order: string;
    x_opencti_color: string;
  };
  created: string;
  objectLabel?: {
    id: string;
    value: string;
    color: string;
  };
  subAttackPatternsIds?: string[];
  level?: number;
  killChainPhases: {
    kill_chain_name: string;
    phase_name: string
  }[];
}

interface AttackPatternsMatrixLineProps {
  data: any; // AttackPatternsMatrixLine_data$data
  dataColumns: DataColumns;
  attackPatterns: AttackPattern[];
  onLabelClick: HandleAddFilter;
  onToggleEntity: (entityId: string) => void;
  onToggleShiftEntity: (
    index: number,
    entity: any, // AttackPatternsMatrixLine_data
    event?: React.SyntheticEvent
  ) => void;
  selectedElements: { [key: string]: AttackPattern };
  deSelectedElements: { [key: string]: AttackPattern };
  selectAll: boolean;
  index: number;
}

const AttackPatternsMatrixLine: FunctionComponent<AttackPatternsMatrixLineProps> = ({
  data,
  dataColumns,
  attackPatterns,
  onLabelClick,
  onToggleEntity,
  onToggleShiftEntity,
  selectedElements,
  deSelectedElements,
  selectAll,
  index,
}) => {
  const theme = useTheme();
  const classes = useStyles();

  const [setNavOpen] = useState(localStorage.getItem('navOpen') === 'true');

  useEffect(() => {
    const subscription = MESSAGING$.toggleNav.subscribe({
      next: () => setNavOpen(localStorage.getItem('navOpen') === 'true'),
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div
      className={classes.container}
      style={{ height: 'calc(100vh - 310px)' }}
    >
      <div
        id="container"
        style={{ width: '100%' }}
      >
        {attackPatterns.map((a) => {
          const killChainNames = a.killChainPhases.map((phase) => phase.kill_chain_name).join(', ');
          const phaseName = a.killChainPhases.length > 0 ? a.killChainPhases[0].phase_name : '';

          return (
            <ListItem
              key={a.id}
              classes={{ root: classes.item }}
              divider={true}
              button={true}
              component={Link}
              to={`/dashboard/techniques/attack_patterns/${a.id}`}
            >
              <ListItemIcon
                style={{ color: theme.palette.primary.main, minWidth: 40 }}
                onClick={(event) => (event.shiftKey
                  ? onToggleShiftEntity(index, data, event)
                  : onToggleEntity(data, event))
                  }
              >
                <Checkbox
                  edge="start"
                  checked={
                        (selectAll && !(a.id in (deSelectedElements || {})))
                        || a.id in (selectedElements || {})
                    }
                  disableRipple={true}
                />
              </ListItemIcon>
              <ListItemIcon style={{ color: theme.palette.primary.main }}>
                <ItemIcon type="Attack-Pattern" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <div key={a.id} className={classes.header}>
                    <Tooltip title={data.killChainPhase}>
                      <div style={{ width: dataColumns.killChainPhase.width }}>
                        [{truncate(killChainNames, 15)}] {truncate(phaseName, 15)}
                      </div>
                    </Tooltip>
                    <div style={{ width: dataColumns.x_mitre_id.width }}>
                      {emptyFilled(a.x_mitre_id)}
                    </div>
                    <div style={{ width: dataColumns.name.width }}>
                      {a.name}
                    </div>
                    <div style={{ width: dataColumns.objectLabel.width }}>
                      <StixCoreObjectLabels
                        variant="inList"
                        labels={a.objectLabel}
                        onClick={onLabelClick}
                      />
                    </div>
                    <div style={{ width: dataColumns.created.width }}>
                      {a.created}
                    </div>
                    <div>
                      <ItemMarkings
                        variant="inList"
                        markingDefinitions={a.objectMarking ?? []}
                        limit={1}
                      />
                    </div>
                  </div>
                  }
              />
            </ListItem>
          );
        })}
      </div>
    </div>
  );
};

export const AttackPatternsMatrixLineQuery = graphql`
    query AttackPatternsMatrixLineQuery(
        $orderBy: AttackPatternsOrdering
        $orderMode: OrderingMode
        $count: Int!
        $cursor: ID
        $filters: FilterGroup
    ) {
        ...AttackPatternsMatrixLine_data
        @arguments(
            orderBy: $orderBy
            orderMode: $orderMode
            count: $count
            cursor: $cursor
            filters: $filters
        )
    }
`;

const AttackPatternsMatrixLineFragment = createRefetchContainer(
  AttackPatternsMatrixLine,
  {
    data: graphql`
            fragment AttackPatternsMatrixLine_data on Query
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
                            objectMarking {
                                id
                                definition_type
                                definition
                                x_opencti_order
                                x_opencti_color
                            }
                            created
                            modified
                            objectLabel {
                                id
                                value
                                color
                            }
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
                            creators {
                                id
                                name
                            }
                        }
                    }
                }
            }
        `,
  },
  attackPatternsLinesQuery,
);

export default AttackPatternsMatrixLine;
