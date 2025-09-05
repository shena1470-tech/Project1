/**
 * 회의실 데이터 전역 관리
 * 한화생명 사내 회의실 목록 및 관련 정보
 */

// 회의실 목록 - 2층부터 20층까지
const MEETING_ROOMS = [
  // 2층
  { id: 'room-2f-e', name: '2F E회의실', floor: 2, side: 'E', capacity: 8, equipment: ['화상회의', '프로젝터', '화이트보드'] },
  { id: 'room-2f-w', name: '2F W회의실', floor: 2, side: 'W', capacity: 6, equipment: ['프로젝터', '화이트보드'] },
  
  // 3층
  { id: 'room-3f-e', name: '3F E회의실', floor: 3, side: 'E', capacity: 10, equipment: ['화상회의', '프로젝터', '화이트보드', '대형모니터'] },
  { id: 'room-3f-w', name: '3F W회의실', floor: 3, side: 'W', capacity: 8, equipment: ['프로젝터', '화이트보드'] },
  
  // 4층
  { id: 'room-4f-e', name: '4F E회의실', floor: 4, side: 'E', capacity: 12, equipment: ['화상회의', '프로젝터', '화이트보드'] },
  { id: 'room-4f-w', name: '4F W회의실', floor: 4, side: 'W', capacity: 10, equipment: ['화상회의', '프로젝터'] },
  
  // 5층
  { id: 'room-5f-e', name: '5F E회의실', floor: 5, side: 'E', capacity: 8, equipment: ['프로젝터', '화이트보드'] },
  { id: 'room-5f-w', name: '5F W회의실', floor: 5, side: 'W', capacity: 6, equipment: ['화이트보드'] },
  
  // 6층
  { id: 'room-6f-e', name: '6F E회의실', floor: 6, side: 'E', capacity: 15, equipment: ['화상회의', '프로젝터', '화이트보드', '음향시설'] },
  { id: 'room-6f-w', name: '6F W회의실', floor: 6, side: 'W', capacity: 12, equipment: ['화상회의', '프로젝터', '화이트보드'] },
  
  // 7층
  { id: 'room-7f-e', name: '7F E회의실', floor: 7, side: 'E', capacity: 10, equipment: ['프로젝터', '화이트보드'] },
  { id: 'room-7f-w', name: '7F W회의실', floor: 7, side: 'W', capacity: 8, equipment: ['프로젝터'] },
  
  // 8층
  { id: 'room-8f-e', name: '8F E회의실', floor: 8, side: 'E', capacity: 20, equipment: ['화상회의', '프로젝터', '화이트보드', '대형모니터', '음향시설'] },
  { id: 'room-8f-w', name: '8F W회의실', floor: 8, side: 'W', capacity: 15, equipment: ['화상회의', '프로젝터', '화이트보드'] },
  
  // 9층
  { id: 'room-9f-e', name: '9F E회의실', floor: 9, side: 'E', capacity: 12, equipment: ['화상회의', '프로젝터'] },
  { id: 'room-9f-w', name: '9F W회의실', floor: 9, side: 'W', capacity: 10, equipment: ['프로젝터', '화이트보드'] },
  
  // 10층
  { id: 'room-10f-e', name: '10F E회의실', floor: 10, side: 'E', capacity: 25, equipment: ['화상회의', '프로젝터', '화이트보드', '대형모니터', '음향시설'] },
  { id: 'room-10f-w', name: '10F W회의실', floor: 10, side: 'W', capacity: 20, equipment: ['화상회의', '프로젝터', '화이트보드', '음향시설'] },
  
  // 11층
  { id: 'room-11f-e', name: '11F E회의실', floor: 11, side: 'E', capacity: 8, equipment: ['프로젝터', '화이트보드'] },
  { id: 'room-11f-w', name: '11F W회의실', floor: 11, side: 'W', capacity: 6, equipment: ['화이트보드'] },
  
  // 12층
  { id: 'room-12f-e', name: '12F E회의실', floor: 12, side: 'E', capacity: 15, equipment: ['화상회의', '프로젝터', '화이트보드'] },
  { id: 'room-12f-w', name: '12F W회의실', floor: 12, side: 'W', capacity: 12, equipment: ['프로젝터', '화이트보드'] },
  
  // 13층
  { id: 'room-13f-e', name: '13F E회의실', floor: 13, side: 'E', capacity: 10, equipment: ['화상회의', '프로젝터'] },
  { id: 'room-13f-w', name: '13F W회의실', floor: 13, side: 'W', capacity: 8, equipment: ['프로젝터'] },
  
  // 14층
  { id: 'room-14f-e', name: '14F E회의실', floor: 14, side: 'E', capacity: 18, equipment: ['화상회의', '프로젝터', '화이트보드', '대형모니터'] },
  { id: 'room-14f-w', name: '14F W회의실', floor: 14, side: 'W', capacity: 15, equipment: ['화상회의', '프로젝터', '화이트보드'] },
  
  // 15층
  { id: 'room-15f-e', name: '15F E회의실', floor: 15, side: 'E', capacity: 30, equipment: ['화상회의', '프로젝터', '화이트보드', '대형모니터', '음향시설', '녹화장비'] },
  { id: 'room-15f-w', name: '15F W회의실', floor: 15, side: 'W', capacity: 25, equipment: ['화상회의', '프로젝터', '화이트보드', '음향시설'] },
  
  // 16층
  { id: 'room-16f-e', name: '16F E회의실', floor: 16, side: 'E', capacity: 12, equipment: ['프로젝터', '화이트보드'] },
  { id: 'room-16f-w', name: '16F W회의실', floor: 16, side: 'W', capacity: 10, equipment: ['프로젝터'] },
  
  // 17층
  { id: 'room-17f-e', name: '17F E회의실', floor: 17, side: 'E', capacity: 14, equipment: ['화상회의', '프로젝터', '화이트보드'] },
  { id: 'room-17f-w', name: '17F W회의실', floor: 17, side: 'W', capacity: 12, equipment: ['프로젝터', '화이트보드'] },
  
  // 18층
  { id: 'room-18f-e', name: '18F E회의실', floor: 18, side: 'E', capacity: 20, equipment: ['화상회의', '프로젝터', '화이트보드', '대형모니터'] },
  { id: 'room-18f-w', name: '18F W회의실', floor: 18, side: 'W', capacity: 18, equipment: ['화상회의', '프로젝터', '화이트보드'] },
  
  // 19층
  { id: 'room-19f-e', name: '19F E회의실', floor: 19, side: 'E', capacity: 16, equipment: ['화상회의', '프로젝터', '화이트보드'] },
  { id: 'room-19f-w', name: '19F W회의실', floor: 19, side: 'W', capacity: 14, equipment: ['프로젝터', '화이트보드'] },
  
  // 20층 (임원층)
  { id: 'room-20f-e', name: '20F E회의실', floor: 20, side: 'E', capacity: 40, equipment: ['화상회의', '프로젝터', '화이트보드', '대형모니터', '음향시설', '녹화장비', '동시통역'] },
  { id: 'room-20f-w', name: '20F W회의실', floor: 20, side: 'W', capacity: 35, equipment: ['화상회의', '프로젝터', '화이트보드', '대형모니터', '음향시설', '녹화장비'] }
];

// 회의실 이름만 추출한 배열 (드롭다운 등에서 사용)
const MEETING_ROOM_NAMES = MEETING_ROOMS.map(room => room.name);

// 회의실 ID로 회의실 정보 가져오기
function getMeetingRoomById(roomId) {
  return MEETING_ROOMS.find(room => room.id === roomId);
}

// 회의실 이름으로 회의실 정보 가져오기
function getMeetingRoomByName(roomName) {
  return MEETING_ROOMS.find(room => room.name === roomName);
}

// 층별 회의실 가져오기
function getMeetingRoomsByFloor(floor) {
  return MEETING_ROOMS.filter(room => room.floor === floor);
}

// 수용 인원에 따른 회의실 필터링
function getMeetingRoomsByCapacity(minCapacity) {
  return MEETING_ROOMS.filter(room => room.capacity >= minCapacity);
}

// 특정 장비가 있는 회의실 필터링
function getMeetingRoomsByEquipment(equipment) {
  return MEETING_ROOMS.filter(room => room.equipment.includes(equipment));
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MEETING_ROOMS,
    MEETING_ROOM_NAMES,
    getMeetingRoomById,
    getMeetingRoomByName,
    getMeetingRoomsByFloor,
    getMeetingRoomsByCapacity,
    getMeetingRoomsByEquipment
  };
}