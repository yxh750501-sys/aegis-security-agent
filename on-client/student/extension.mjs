// 이 파일은 학생이 같은 프로젝트에서 이어서 구현합니다.
// 제공 UI를 받은 것만으로 단계 완료를 인정하지 않습니다.
export function createStudentView() {
  return {
    renderIdentity({ me, devices, sessions } = {}) {
      const root = document.createElement('div');
      const modeLabels = {
        connected: '연결됨',
        demo: '예제 자료',
        disconnected: '연결 없음',
        unknown: '확인 불가',
      };
      const deviceStatusLabels = {
        compliant: '보안 기준 충족',
        noncompliant: '보안 기준 미충족',
        unknown: '확인 불가',
      };
      const sessionStatusLabels = {
        active: '활성',
        expired: '만료',
        revoked: '철회됨',
        unknown: '확인 불가',
      };
      const valueOrUnknown = (value) => typeof value === 'string' && value.length > 0 ? value : '확인 불가';
      const translated = (labels, value) => Object.hasOwn(labels, value) ? `${labels[value]} (${value})` : '확인 불가';
      const addText = (parent, tag, text) => {
        const node = document.createElement(tag);
        node.textContent = text;
        parent.append(node);
        return node;
      };
      const addResourceHeader = (section, title, resource) => {
        addText(section, 'h3', title);
        const mode = resource && modeLabels[resource.mode] ? modeLabels[resource.mode] : modeLabels.unknown;
        addText(section, 'p', `연결 상태: ${mode}`);
        if (!resource || resource.status === 'loading') {
          addText(section, 'p', '불러오는 중');
          return false;
        }
        if (resource.status === 'error') {
          const message = resource.error && typeof resource.error.message === 'string' && resource.error.message.length > 0
            ? resource.error.message
            : '확인 불가';
          addText(section, 'p', `연결 실패: ${message}`);
          return false;
        }
        if (resource.status !== 'ok') {
          addText(section, 'p', '확인 불가');
          return false;
        }
        return true;
      };
      const addIdentityField = (section, label, value) => {
        addText(section, 'p', `${label}: ${valueOrUnknown(value)}`);
      };
      const addList = (section, resource, title, singular, getFields) => {
        if (!addResourceHeader(section, title, resource)) return;
        if (!Array.isArray(resource.data)) {
          addText(section, 'p', '확인 불가');
          return;
        }
        if (resource.data.length === 0) {
          addText(section, 'p', `${singular} 없음`);
          return;
        }
        const list = document.createElement('ul');
        resource.data.forEach((item) => {
          const row = document.createElement('li');
          getFields(row, item && typeof item === 'object' ? item : {});
          list.append(row);
        });
        section.append(list);
      };

      const meSection = document.createElement('section');
      if (addResourceHeader(meSection, '로그인 사용자·기기·세션', me)) {
        const data = me.data && typeof me.data === 'object' ? me.data : {};
        const user = data.user && typeof data.user === 'object' ? data.user : {};
        const device = data.device && typeof data.device === 'object' ? data.device : {};
        const session = data.session && typeof data.session === 'object' ? data.session : {};
        addIdentityField(meSection, '사용자 ID', user.id);
        addIdentityField(meSection, '사용자 이름', user.label);
        addIdentityField(meSection, '기기 ID', device.id);
        addIdentityField(meSection, '기기 이름', device.label);
        addText(meSection, 'p', `기기 상태: ${translated(deviceStatusLabels, device.status)}`);
        addIdentityField(meSection, '세션 ID', session.id);
        addText(meSection, 'p', `세션 상태: ${translated(sessionStatusLabels, session.status)}`);
      }
      root.append(meSection);

      const devicesSection = document.createElement('section');
      addList(devicesSection, devices, '기기 목록', '기기', (row, item) => {
        addIdentityField(row, '기기 ID', item.id);
        addIdentityField(row, '이름', item.label);
        addText(row, 'p', `상태: ${translated(deviceStatusLabels, item.status)}`);
      });
      root.append(devicesSection);

      const sessionsSection = document.createElement('section');
      addList(sessionsSection, sessions, '세션 목록', '세션', (row, item) => {
        addIdentityField(row, '세션 ID', item.id);
        addText(row, 'p', `상태: ${translated(sessionStatusLabels, item.status)}`);
      });
      root.append(sessionsSection);

      return root;
    },
    renderDecision() { return '학생 구현 대기: 서버의 판정과 이유를 연결하세요.'; },
    renderEvents() { return '학생 구현 대기: 본인 접속·XDR 기록을 연결하세요.'; },
    renderStatus() { return '학생 구현 대기: 기기·세션·알림과 연결 점검 상태를 구분하세요.'; },
    renderVulnerabilities() { return '학생 구현 대기: 정확한 설치 버전·OSV 출처·조회 시각·부분 결과·조회 실패를 구분하세요.'; },
    renderAiConnection() { return '학생 구현 대기: 모델 응답 점검과 실제 사건 설명을 구분하고 AI 오류·취소·수동 복구를 안내하세요.'; },
    renderExplanation() { return '학생 구현 대기: 선택한 사건의 근거·규칙·현재 상태와 AI 설명을 연결하세요. 제안은 자동 실행하지 않습니다.'; },
    renderAction() { return '학생 구현 대기: 현재 사건·조치·실제 대상·사람 확인·ACK와 원천 효과·unknown을 구분하세요.'; },
  };
}
