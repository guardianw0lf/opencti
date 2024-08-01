import React, { FunctionComponent } from 'react';
import { TargetEntity } from '@components/common/stix_core_relationships/StixCoreRelationshipCreationFromEntity';
import {
  StixDomainObjectAttackPatternsKillChainContainer_data$data,
} from '@components/common/stix_domain_objects/__generated__/StixDomainObjectAttackPatternsKillChainContainer_data.graphql';
import AttackPatternsMatrixLines, { attackPatternsMatrixLinesQuery } from '@components/techniques/attack_patterns/AttackPatternsMatrixLines';
import { QueryRenderer } from '../../../../relay/environment';
import Loader from '../../../../components/Loader';
import { AttackPatternsMatrixColumnsQuery } from './__generated__/AttackPatternsMatrixColumnsQuery.graphql';
import { DataColumns } from '../../../../components/list_lines';

interface AttackPatternsMatrixInLineProps {
  marginRight?: boolean;
  attackPatterns: NonNullable<NonNullable<StixDomainObjectAttackPatternsKillChainContainer_data$data>['attackPatterns']>['edges'][0]['node'][];
  dataColumns: DataColumns;
  searchTerm?: string;
  handleToggleColorsReversed: () => void;
  currentColorsReversed: boolean;
  hideBar: boolean;
  handleAdd: (entity: TargetEntity) => void;
}
const AttackPatternsMatrixInLine: FunctionComponent<AttackPatternsMatrixInLineProps> = ({
  attackPatterns,
  marginRight,
  searchTerm,
  handleToggleColorsReversed,
  currentColorsReversed,
  hideBar,
  handleAdd,
  dataColumns,
}) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      margin: 0,
      padding: 0,
    }}
    >
      <QueryRenderer
        query={attackPatternsMatrixLinesQuery}
        variables={{
          count: 5000,
          filters: {
            mode: 'and',
            filters: [{ key: 'revoked', values: ['false'] }],
            filterGroups: [],
          },
        }}
        render={({ props }: { props: AttackPatternsMatrixColumnsQuery | null }) => {
          if (props) {
            return (
              <AttackPatternsMatrixLines
                data={props}
                dataColumns={dataColumns}
                attackPatterns={attackPatterns}
                marginRight={marginRight}
                searchTerm={searchTerm ?? ''}
                handleToggleColorsReversed={handleToggleColorsReversed}
                currentColorsReversed={currentColorsReversed}
                hideBar={hideBar}
                handleAdd={handleAdd}
              />
            );
          }
          return <Loader />;
        }}
      />
    </div>
  );
};

export default AttackPatternsMatrixInLine;
