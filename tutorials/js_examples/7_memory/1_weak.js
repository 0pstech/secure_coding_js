import memoryHogLibrary from './ext-memory-log.js';

// 실행 방법: node --expose-gc 1_weak.js


// 1. 메모리 누수 - 클로저로 인한 참조 유지
// 클로저는 함수와 그 함수가 선언된 렉시컬 환경의 조합입니다.
// 아래 예제에서는 내부 함수가 외부 함수의 변수(largeData)를 참조하고 있어,
// 함수가 호출된 후에도 해당 변수가 메모리에서 해제되지 않고 프로그램 종료 전까지 유지됩니다.
function createLargeDataProcessor() {
  // 큰 데이터 배열 생성 (약 80MB)
  const largeData = new Array(10_000_000).fill('메모리를 많이 사용하는 데이터');
  
  return function process() {
    // 데이터의 일부만 사용하지만 전체 배열이 메모리에 유지됨
    console.log(`데이터 처리: ${largeData.length}개 항목 중 첫 번째 항목 길이: ${largeData[0].length}`);
  };
}

// 2. 순환 참조로 인한 메모리 누수
function createCircularReference() {
  let obj1 = {};
  let obj2 = {};
  
  // 순환 참조 생성
  obj1.ref = obj2;
  obj2.ref = obj1;
  
  return function() {
    // 이 함수가 참조되는 한 obj1과 obj2는 메모리에서 해제되지 않음
    console.log("순환 참조 객체에 접근:", Object.keys(obj1), Object.keys(obj2));
  };
}

// 3. 이벤트 리스너 미제거로 인한 메모리 누수 시뮬레이션
const eventEmitter = {
  listeners: [],
  addEventListener(callback) {
    this.listeners.push(callback);
  },
  removeEventListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  },
  emit() {
    this.listeners.forEach(listener => listener());
  }
};

function setupEventHandlers() {
  // 큰 데이터를 가진 객체
  const data = new Array(1_000_000).fill('이벤트 데이터');
  
  // 이벤트 리스너 등록
  const handler = () => {
    console.log(`이벤트 발생: 데이터 크기 ${data.length}`);
  };
  
  eventEmitter.addEventListener(handler);
  
  // 이벤트 리스너를 제거하지 않음
  // 올바른 방법: eventEmitter.removeEventListener(handler);
}

// 4. 외부 라이브러리의 메모리 관리 문제
function useExternalLibrary() {
  // 많은 데이터를 반복적으로 처리
  for (let i = 0; i < 1000; i++) {
    memoryHogLibrary.processData(`item-${i}`, `대용량 데이터 ${i}`);
  }
  
  // 라이브러리의 캐시 정리 메서드를 호출해도 메모리 문제 해결 안 됨
  // 이유: clearCache 메서드는 10초 이상 지난 항목만 제거하고,
  // 최근 생성된 항목은 그대로 유지되어 메모리 누수가 계속됨
  // 또한 대량의 데이터(100,000개 배열)를 각 항목마다 저장하고 있음
  memoryHogLibrary.clearCache();
}

// 5. WeakMap/WeakSet을 사용하지 않아 발생하는 메모리 문제
function createDomNodeRegistry() {
  // Map을 사용하면 참조된 DOM 노드가 메모리에서 해제되지 않음
  // WeakMap을 사용해야 DOM 노드가 삭제될 때 자동으로 메모리에서 해제됨
  const registry = new Map();
  
  return {
    register: function(element, metadata) {
      registry.set(element, metadata);
    },
    getMetadata: function(element) {
      return registry.get(element);
    },
    getSize: function() {
      return registry.size;
    }
  };
}

// 6. 메모리 참조 에러 테스트 함수
function testNullReferenceError() {
  try {
    let obj = null;
    // null 객체의 속성에 접근 시도 - 참조 에러 발생
    console.log(obj.property);
  } catch (error) {
    console.error(`참조 에러 발생: ${error.message}`);
  }
}

function testUndefinedReferenceError() {
  try {
    let arr = [1, 2, 3];
    // 배열 범위를 벗어난 인덱스 접근 - undefined 반환
    let item = arr[10];
    // undefined의 메소드 호출 시도 - 참조 에러 발생
    console.log(item.toString());
  } catch (error) {
    console.error(`참조 에러 발생: ${error.message}`);
  }
}

// 7. 정수 오버플로우 테스트 함수
function testIntegerOverflow() {
  // JavaScript에서 안전한 정수 범위: -(2^53 - 1) ~ (2^53 - 1)
  const maxSafeInteger = Number.MAX_SAFE_INTEGER; // 9007199254740991
  console.log(`최대 안전 정수: ${maxSafeInteger}`);
  
  // 오버플로우 발생
  const overflowed = maxSafeInteger + 10;
  console.log(`오버플로우 결과: ${overflowed}`);
  console.log(`정밀도 손실 확인: ${overflowed === overflowed + 1}`);
  
  // 참고: JavaScript의 오버플로우는 C언어와 달리 메모리 손상이나 익스플로잇으로 이어지지 않음
  // JavaScript는 정수 오버플로우 시 자동으로 부동소수점으로 변환하거나 정밀도를 잃을 뿐,
  // 버퍼 오버런이나 메모리 손상 같은 보안 취약점이 발생하지 않음
  console.log("JavaScript에서 정수 오버플로우는 C언어와 달리 메모리 손상이나 보안 취약점으로 이어지지 않습니다.");
  console.log("대신 정밀도 손실이나 예상치 못한 계산 결과만 발생합니다.");
}

// 8. 배열 버퍼 오버플로우 테스트 함수
function testArrayBufferOverflow() {
  try {
    // 고정 크기 버퍼 생성
    const buffer = new ArrayBuffer(4); // 4바이트 버퍼
    const view = new Uint8Array(buffer);
    
    // 버퍼 크기 내 접근
    view[0] = 10;
    view[3] = 40;
    console.log(`버퍼 내 값: ${view[0]}, ${view[3]}`);
    
    // 버퍼 범위를 벗어난 접근 시도
    view[4] = 50; // 범위를 벗어남
    console.log(`범위 외 접근 결과: ${view[4]}`);
    
    // 참고: JavaScript의 TypedArray는 범위를 벗어난 접근 시 C언어처럼 메모리 손상이 발생하지 않음
    // 대신 값이 무시되거나 undefined를 반환함
    console.log("JavaScript의 TypedArray는 범위를 벗어난 접근 시 메모리 손상이나 익스플로잇이 발생하지 않습니다.");
    console.log("JavaScript 엔진이 경계 검사를 수행하여 메모리 안전성을 보장합니다.");
  } catch (error) {
    console.error(`버퍼 오버플로우 에러: ${error.message}`);
  }
}


// 메모리 사용량 측정 함수
function getMemoryUsage() {
  if (global.gc) {
    global.gc(); // 가비지 컬렉션 강제 실행
  }
  
  const memoryUsage = process.memoryUsage();
  return {
    rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
    heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
    external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`
  };
}

// 테스트 시작 전 메모리 사용량 측정
console.log("\n--------------------------------");
console.log("테스트 시작 전 메모리 사용량:");
console.log(getMemoryUsage());

// 각 테스트 사이에 시간 간격을 두어 가비지 컬렉션 기회 제공
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function runTests() {
  // 1. 클로저로 인한 메모리 누수 테스트
  console.log("--------------------------------");
  console.log("1. 클로저로 인한 메모리 누수");
  const processor = createLargeDataProcessor();
  processor(); // 함수를 호출해도 largeData는 메모리에서 해제되지 않음
  console.log("디버깅: largeData 배열이 메모리에 계속 유지됨 (약 80MB)");
  await delay(1000);
  console.log("1초 후 메모리 사용량:", getMemoryUsage());

  // 2. 순환 참조 테스트
  console.log("--------------------------------");
  console.log("2. 순환 참조로 인한 메모리 누수");
  const circularRef = createCircularReference();
  circularRef();
  console.log("디버깅: 순환 참조된 객체들이 메모리에서 해제되지 않음");
  await delay(1000);
  console.log("1초 후 메모리 사용량:", getMemoryUsage());

  // 3. 이벤트 리스너 미제거 테스트
  console.log("--------------------------------");
  console.log("3. 이벤트 리스너 미제거");
  for (let i = 0; i < 10; i++) {
    setupEventHandlers();
  }
  console.log(`디버깅: 제거되지 않은 이벤트 리스너 수: ${eventEmitter.listeners.length}`);
  await delay(1000);
  console.log("1초 후 메모리 사용량:", getMemoryUsage());

  // 4. 외부 라이브러리 메모리 관리 문제 테스트
  console.log("--------------------------------");
  console.log("4. 외부 라이브러리 메모리 관리 문제");
  useExternalLibrary();
  console.log(`디버깅: 라이브러리 캐시 항목 수: ${Object.keys(memoryHogLibrary.cache).length}`);
  await delay(1000);
  console.log("1초 후 메모리 사용량:", getMemoryUsage());

  // 5. WeakMap 미사용 테스트
  console.log("--------------------------------");
  console.log("5. WeakMap 미사용으로 인한 메모리 누수");
  const domNodes = [];
  const registry = createDomNodeRegistry();

  // 많은 DOM 노드 생성 및 등록
  for (let i = 0; i < 1000; i++) {
    const node = { id: `node-${i}`, content: `노드 콘텐츠 ${i}` };
    domNodes.push(node);
    registry.register(node, { lastAccessed: Date.now() });
  }

  // DOM 노드 삭제 시뮬레이션
  domNodes.length = 0; // 배열 비우기
  // 하지만 registry에는 여전히 참조가 남아있음
  console.log(`디버깅: 레지스트리 크기 (메모리 누수): ${registry.getSize()}`);
  await delay(1000);
  console.log("1초 후 메모리 사용량:", getMemoryUsage());
}

// 테스트 실행
runTests().then(() => {
  console.log("\n--------------------------------");
  console.log("모든 테스트 완료 후 최종 메모리 사용량:");
  console.log(getMemoryUsage());
  console.log("--------------------------------");
  console.log("메모리 누수로 인해 사용량이 크게 증가했습니다.");
});

// // 테스트 실행 코드
// // 6. 메모리 참조 에러 테스트
// console.log("--------------------------------");
// console.log("6. 메모리 참조 에러");
// testNullReferenceError();
// testUndefinedReferenceError();

// // 7. 정수 오버플로우 테스트
// console.log("--------------------------------");
// console.log("7. 정수 오버플로우");
// testIntegerOverflow();

// // 8. 배열 버퍼 오버플로우 테스트
// console.log("--------------------------------");
// console.log("8. 배열 버퍼 오버플로우");
// testArrayBufferOverflow();
