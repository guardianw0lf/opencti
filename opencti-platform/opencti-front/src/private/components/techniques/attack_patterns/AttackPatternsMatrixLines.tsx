import React, { FunctionComponent } from 'react';
import { TargetEntity } from '@components/common/stix_core_relationships/StixCoreRelationshipCreationFromEntity';
import {
  StixDomainObjectAttackPatternsKillChainContainer_data$data,
} from '@components/common/stix_domain_objects/__generated__/StixDomainObjectAttackPatternsKillChainContainer_data.graphql';
import AttackPatternsMatrixLine, { AttackPatternsMatrixLineQuery } from '@components/techniques/attack_patterns/AttackPatternsMatrixLine';
import { QueryRenderer } from '../../../../relay/environment';
import Loader from '../../../../components/Loader';
import { AttackPatternsMatrixColumnsQuery } from './__generated__/AttackPatternsMatrixColumnsQuery.graphql';
import { DataColumns } from '../../../../components/list_lines';

interface AttackPatternsMatrixLinesProps {
  marginRight?: boolean;
  attackPatterns: NonNullable<NonNullable<StixDomainObjectAttackPatternsKillChainContainer_data$data>['attackPatterns']>['edges'][0]['node'][];
  dataColumns: DataColumns;
  searchTerm?: string;
  hideBar: boolean;
  handleAdd: (entity: TargetEntity) => void;
}
const AttackPatternsMatrixLines: FunctionComponent<AttackPatternsMatrixLinesProps> = ({
  attackPatterns,
  marginRight,
  searchTerm,
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
        query={AttackPatternsMatrixLineQuery}
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
              <AttackPatternsMatrixLine
                data={props}
                dataColumns={dataColumns}
                attackPatterns={attackPatterns}
                marginRight={marginRight}
                searchTerm={searchTerm ?? ''}
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

export default AttackPatternsMatrixLines;
