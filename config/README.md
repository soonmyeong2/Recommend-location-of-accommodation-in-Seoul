# Setting

본 프로젝트는 hadoop clustering하여 데이터 분산하여 저장하여 spark로 processing하였으며 각각 설정한 환경 설정 파일들이다.

hosts는 각 분산된 노드 모두 환경에 맞게 ip 및 hostname을 수정해여 사용해여야하 하며,
hadoop은 master node와 slave node의 configuration 파일이 달라 분할하여 각각의 node에 맞게 hadoop/etc/ 에 저장한다.
또한 spark는 yarn을 이용하여 실행하기 위해 master 노드에서 conf/의 설정을 변경한다.
