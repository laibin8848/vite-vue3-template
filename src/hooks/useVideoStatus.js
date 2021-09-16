export default function useVideoStatus() {
  const videoStatusMap = {
    0: '未上架',
    1: '已上架',
    2: '已下架'
  }

  const videoStatusList = []

  for(const key in videoStatusMap) {
    videoStatusList.push({ label: videoStatusMap[key], value: key })
  }

  return {
    videoStatusMap,
    videoStatusList
  }
}
