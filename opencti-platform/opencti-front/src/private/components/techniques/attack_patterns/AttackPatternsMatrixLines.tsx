import React, { FunctionComponent } from 'react';
import {
  StixDomainObjectAttackPatternsKillChainContainer_data$data,
} from '@components/common/stix_domain_objects/__generated__/StixDomainObjectAttackPatternsKillChainContainer_data.graphql';
import AttackPatternsMatrixLine, { AttackPatternsMatrixLineQuery } from '@components/techniques/attack_patterns/AttackPatternsMatrixLine';
import { QueryRenderer } from '../../../../relay/environment';
import Loader from '../../../../components/Loader';
import { AttackPatternsMatrixColumnsQuery } from './__generated__/AttackPatternsMatrixColumnsQuery.graphql';
import { DataColumns } from '../../../../components/list_lines';

interface AttackPatternsMatrixLinesProps {
  attackPatterns: NonNullable<NonNullable<StixDomainObjectAttackPatternsKillChainContainer_data$data>['attackPatterns']>['edges'][0]['node'][];
  dataColumns: DataColumns;
}
const AttackPatternsMatrixLines: FunctionComponent<AttackPatternsMatrixLinesProps> = ({
  attackPatterns,
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
