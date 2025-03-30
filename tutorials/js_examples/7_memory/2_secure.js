import memoryHogLibrary from './ext-memory-log.js';

// 실행 방법: node --expose-gc 2_secure.js

// 1. 메모리 누수 방지 - 클로저 사용 시 주의사항
// 클로저는 함수와 그 함수가 선언된 렉시컬 환경의 조합입니다.
// 아래 예제에서는 필요한 데이터만 참조하도록 개선하여 메모리 누수를 방지합니다.
function createLargeDataProcessor() {
  // 큰 데이터 배열 생성 (약 80MB)
  const largeData = new Array(10_000_000).fill('메모리를 많이 사용하는 데이터');
  
  // 필요한 정보만 추출하여 반환
  const dataLength = largeData.length;
  const firstItemLength = largeData[0].length;
  
  // 원본 데이터 참조 해제
  largeData.length = 0;
  
  return function process() {
    // 필요한 정보만 사용하여 메모리 효율성 향상
    console.log(`데이터 처리: ${dataLength}개 항목 중 첫 번째 항목 길이: ${firstItemLength}`);
  };
}

// 2. 순환 참조 방지
function createSafeReference() {
  let obj1 = {};
  let obj2 = {};
  
  // 약한 참조 사용 또는 단방향 참조로 변경
  obj1.id = "obj1";
  obj2.parentId = "obj1";
  
  // 함수 종료 시 참조 정리
  const result = function() {
    console.log("안전한 객체 참조:", obj1.id, obj2.parentId);
  };
  
  // 함수 종료 시 참조 해제를 위한 메서드 추가
  result.cleanup = function() {
    obj1 = null;
    obj2 = null;
  };
  
  return result;
}

// 3. 이벤트 리스너 안전한 관리
const eventEmitter = {
  listeners: [],
  addEventListener(callback) {
    this.listeners.push(callback);
    // 리스너 제거 함수 반환
    return () => this.removeEventListener(callback);
  },
  removeEventListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  },
  emit() {
    this.listeners.forEach(listener => listener());
  },
  // 모든 리스너 제거 메서드 추가
  removeAllListeners() {
    this.listeners = [];
  }
};

function setupEventHandlers() {
  // 필요한 데이터만 캡처
  const dataSize = 1_000_000;
  
  // 이벤트 리스너 등록 및 제거 함수 저장
  const handler = () => {
    console.log(`이벤트 발생: 데이터 크기 ${dataSize}`);
  };
  
  const removeListener = eventEmitter.addEventListener(handler);
  
  // 사용 완료 후 리스너 제거 함수 반환
  return removeListener;
}

// 4. 외부 라이브러리 안전한 사용
function useExternalLibrarySafely() {
  // 배치 처리로 메모리 사용량 제한
  const batchSize = 100;
  
  for (let i = 0; i < 1000; i += batchSize) {
    // 배치 단위로 처리 - 메모리 안전성 향상
    // 전체 데이터를 한 번에 처리하지 않고 작은 배치로 나누어 처리함
    const endIndex = Math.min(i + batchSize, 1000);
    
    // 이 방식이 안전한 이유:
    // 1. 한 번에 메모리에 로드되는 데이터 양이 제한됨
    // 2. 각 배치 처리 후 캐시 정리와 GC가 가능해 메모리 누수 방지
    // 3. 대규모 작업을 작은 단위로 분할하여 메모리 사용량 피크를 낮춤
    for (let j = i; j < endIndex; j++) {
      memoryHogLibrary.processData(`item-${j}`, `대용량 데이터 ${j}`);
    }
    
    // 각 배치 후 캐시 정리
    memoryHogLibrary.clearCache();
    
    // 필요시 가비지 컬렉션 힌트 제공
    if (global.gc) {
      global.gc();
    }
  }
  
  // 작업 완료 후 전체 캐시 정리
  // 1. 이상적인 경우: 라이브러리에 clearAllCache 메서드가 있다면 사용
  // memoryHogLibrary.clearAllCache();
  
  // 2. 의존성 라이브러리 수정이 불가능한 경우의 대안:
  // 캐시 객체에 직접 접근하여 수동으로 정리
  if (memoryHogLibrary.cache) {
    // 방법 1: 캐시 객체 비우기
    Object.keys(memoryHogLibrary.cache).forEach(key => {
      delete memoryHogLibrary.cache[key];
    });
    
    // 방법 2: 새 빈 객체로 대체 (더 효율적)
    // memoryHogLibrary.cache = {};
    
    console.log('외부 라이브러리 캐시를 수동으로 정리했습니다.');
  }
  
  // 가비지 컬렉션 힌트 제공
  if (global.gc) {
    global.gc();
  }
}

// 5. WeakMap/WeakSet을 사용한 메모리 관리 개선
function createDomNodeRegistry() {
  // WeakMap 사용으로 DOM 노드가 삭제될 때 자동으로 메모리에서 해제됨
  const registry = new WeakMap();
  
  return {
    register: function(element, metadata) {
      if (!element || typeof element !== 'object') {
        throw new TypeError('Element must be an object');
      }
      registry.set(element, metadata);
    },
    getMetadata: function(element) {
      return registry.get(element);
    },
    // WeakMap은 size 속성이 없으므로 대안 제공
    hasElement: function(element) {
      return registry.has(element);
    }
  };
}

// 6. 안전한 메모리 참조 처리
function testSafeNullReference() {
  try {
    let obj = null;
    // null 체크 후 안전하게 접근
    console.log(obj && obj.property || '속성이 없습니다');
    
    // 옵셔널 체이닝 사용
    console.log(obj?.property || '속성이 없습니다');
  } catch (error) {
    console.error(`참조 에러 발생: ${error.message}`);
  }
}

function testSafeUndefinedReference() {
  try {
    let arr = [1, 2, 3];
    // 배열 범위 검사 후 안전하게 접근
    const index = 10;
    const item = index < arr.length ? arr[index] : undefined;
    
    // 안전한 메서드 호출
    console.log(item !== undefined ? item.toString() : '유효하지 않은 항목');
  } catch (error) {
    console.error(`참조 에러 발생: ${error.message}`);
  }
}

// 7. 안전한 정수 처리
function testSafeIntegerHandling() {
  // JavaScript에서 안전한 정수 범위: -(2^53 - 1) ~ (2^53 - 1)
  const maxSafeInteger = Number.MAX_SAFE_INTEGER; // 9007199254740991
  console.log(`최대 안전 정수: ${maxSafeInteger}`);
  
  // 안전한 정수 범위 검사
  const value = maxSafeInteger + 10;
  if (!Number.isSafeInteger(value)) {
    console.log(`경고: ${value}는 안전한 정수 범위를 벗어났습니다`);
    
    // BigInt 사용으로 정밀도 유지
    const safeBigInt = BigInt(maxSafeInteger) + 10n;
    console.log(`BigInt 사용 결과: ${safeBigInt.toString()}`);
  }
  
  console.log("JavaScript에서는 Number.isSafeInteger()로 안전한 정수 범위를 확인하고,");
  console.log("정밀도가 중요한 큰 정수 계산에는 BigInt를 사용하는 것이 좋습니다.");
}

// 8. 안전한 배열 버퍼 접근
function testSafeArrayBufferAccess() {
  try {
    // 고정 크기 버퍼 생성
    const buffer = new ArrayBuffer(4); // 4바이트 버퍼
    const view = new Uint8Array(buffer);
    
    // 버퍼 크기 내 접근
    view[0] = 10;
    view[3] = 40;
    console.log(`버퍼 내 값: ${view[0]}, ${view[3]}`);
    
    // 범위 검사 후 안전하게 접근
    const index = 4;
    if (index < view.length) {
      view[index] = 50;
    } else {
      console.log(`안전한 접근: 인덱스 ${index}는 버퍼 범위(${view.length})를 벗어납니다`);
    }
    
    console.log("JavaScript의 TypedArray는 범위 검사를 내장하고 있어 메모리 안전성을 보장합니다.");
    console.log("추가적인 범위 검사로 더 안전한 코드를 작성할 수 있습니다.");
  } catch (error) {
    console.error(`버퍼 접근 에러: ${error.message}`);
  }
}


// 메모리 사용량 측정 및 모니터링 함수
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
  // 1. 클로저 메모리 관리 테스트
  console.log("--------------------------------");
  console.log("1. 안전한 클로저 메모리 관리");
  const processor = createLargeDataProcessor();
  processor();
  console.log("메모리 개선: 필요한 데이터만 참조하여 메모리 사용량 감소");
  await delay(1000); // 1초 대기
  console.log("1초 후 메모리 사용량:", getMemoryUsage());

  // 2. 안전한 참조 테스트
  console.log("--------------------------------");
  console.log("2. 순환 참조 방지");
  const safeRef = createSafeReference();
  safeRef();
  safeRef.cleanup();
  console.log("메모리 개선: 명시적 참조 해제로 메모리 누수 방지");
  await delay(1000);
  console.log("1초 후 메모리 사용량:", getMemoryUsage());

  // 3. 이벤트 리스너 안전한 관리 테스트
  console.log("--------------------------------");
  console.log("3. 이벤트 리스너 안전한 관리");
  const removeListeners = [];
  for (let i = 0; i < 10; i++) {
    removeListeners.push(setupEventHandlers());
  }
  console.log(`등록된 이벤트 리스너 수: ${eventEmitter.listeners.length}`);
  removeListeners.forEach(remove => remove());
  console.log(`정리 후 이벤트 리스너 수: ${eventEmitter.listeners.length}`);
  await delay(1000);
  console.log("1초 후 메모리 사용량:", getMemoryUsage());

  // 4. 외부 라이브러리 안전한 사용 테스트
  console.log("--------------------------------");
  console.log("4. 외부 라이브러리 안전한 사용");
  useExternalLibrarySafely();
  console.log("메모리 개선: 배치 처리와 주기적 캐시 정리로 메모리 사용량 제한");
  await delay(1000);
  console.log("1초 후 메모리 사용량:", getMemoryUsage());

  // 5. WeakMap 사용 테스트
  console.log("--------------------------------");
  console.log("5. WeakMap을 사용한 메모리 관리");
  const domNodes = [];
  const registry = createDomNodeRegistry();

  for (let i = 0; i < 1000; i++) {
    const node = { id: `node-${i}`, content: `노드 콘텐츠 ${i}` };
    domNodes.push(node);
    registry.register(node, { lastAccessed: Date.now() });
  }

  const remainingNode = domNodes[0];
  domNodes.length = 0;
  console.log(`남은 노드 메타데이터 존재 여부: ${registry.hasElement(remainingNode)}`);
  console.log("메모리 개선: WeakMap 사용으로 참조 해제된 객체의 메모리 자동 정리");
  await delay(1000);
  console.log("1초 후 메모리 사용량:", getMemoryUsage());
}

// 테스트 실행
runTests().then(() => {
  console.log("\n--------------------------------");
  console.log("모든 테스트 완료 후 최종 메모리 사용량:");
  console.log(getMemoryUsage());
  console.log("--------------------------------");
  console.log("안전한 메모리 관리로 메모리 사용량이 효율적으로 유지됩니다.");
});

// // 안전한 참조 테스트
// // 6. 안전한 메모리 참조 테스트
// console.log("--------------------------------");
// console.log("6. 안전한 메모리 참조");
// testSafeNullReference();
// testSafeUndefinedReference();

// // 7. 안전한 정수 처리 테스트
// console.log("--------------------------------");
// console.log("7. 안전한 정수 처리");
// testSafeIntegerHandling();

// // 8. 안전한 배열 버퍼 접근 테스트
// console.log("--------------------------------");
// console.log("8. 안전한 배열 버퍼 접근");
// testSafeArrayBufferAccess();
