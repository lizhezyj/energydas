export function getDataColumns(sensorCodeToTdList) {
  function setDataTitleWithSensorCode(title) {
    for (var i = 0; i < sensorCodeToTdList.length; i++) {
      if (title.split('td')[1] == sensorCodeToTdList[i].text) {
        return `${title}(${sensorCodeToTdList[i].value})`
      }
    }
    return title
  }

  return [{
    title: setDataTitleWithSensorCode('td1'),
    align: "center",
    dataIndex: 'td1',
    remove: true,
    scopedSlots: {
      customRender: 'td1'
    }
  },
  {
    title: `tv1`,
    align: "center",
    dataIndex: 'tv1',
    remove: true,
    scopedSlots: {
      customRender: 'tv1'
    }
  },
  {
    title: setDataTitleWithSensorCode('td2'),
    align: "center",
    dataIndex: 'td2',
    remove: true,
    scopedSlots: {
      customRender: 'td2'
    }
  },
  {
    title: `tv2`,
    align: "center",
    dataIndex: 'tv2',
    remove: true,
    scopedSlots: {
      customRender: 'tv2'
    }
  },
  {
    title: setDataTitleWithSensorCode('td3'),
    align: "center",
    dataIndex: 'td3',
    remove: true,
    scopedSlots: {
      customRender: 'td3'
    }
  },
  {
    title: `tv3`,
    align: "center",
    dataIndex: 'tv3',
    remove: true,
    scopedSlots: {
      customRender: 'tv3'
    }
  },
  {
    title: setDataTitleWithSensorCode('td4'),
    align: "center",
    dataIndex: 'td4',
    remove: true,
    scopedSlots: {
      customRender: 'td4'
    }
  },
  {
    title: `tv4`,
    align: "center",
    dataIndex: 'tv4',
    remove: true,
    scopedSlots: {
      customRender: 'tv4'
    }
  },
  {
    title: setDataTitleWithSensorCode('td5'),
    align: "center",
    dataIndex: 'td5',
    remove: true,
    scopedSlots: {
      customRender: 'td5'
    }
  },
  {
    title: `tv5`,
    align: "center",
    dataIndex: 'tv5',
    remove: true,
    scopedSlots: {
      customRender: 'tv5'
    }
  },
  {
    title: setDataTitleWithSensorCode('td6'),
    align: "center",
    dataIndex: 'td6',
    remove: true,
    scopedSlots: {
      customRender: 'td6'
    }
  },
  {
    title: `tv6`,
    align: "center",
    dataIndex: 'tv6',
    remove: true,
    scopedSlots: {
      customRender: 'tv6'
    }
  },
  {
    title: setDataTitleWithSensorCode('td7'),
    align: "center",
    dataIndex: 'td7',
    remove: true,
    scopedSlots: {
      customRender: 'td7'
    }
  },
  {
    title: `tv7`,
    align: "center",
    dataIndex: 'tv7',
    remove: true,
    scopedSlots: {
      customRender: 'tv7'
    }
  },
  {
    title: setDataTitleWithSensorCode('td8'),
    align: "center",
    dataIndex: 'td8',
    remove: true,
    scopedSlots: {
      customRender: 'td8'
    }
  },
  {
    title: `tv8`,
    align: "center",
    dataIndex: 'tv8',
    remove: true,
    scopedSlots: {
      customRender: 'tv8'
    }
  },
  {
    title: setDataTitleWithSensorCode('td9'),
    align: "center",
    dataIndex: 'td9',
    remove: true,
    scopedSlots: {
      customRender: 'td9'
    }
  },
  {
    title: `tv9`,
    align: "center",
    dataIndex: 'tv9',
    remove: true,
    scopedSlots: {
      customRender: 'tv9'
    }
  },
  {
    title: setDataTitleWithSensorCode('td10'),
    align: "center",
    dataIndex: 'td10',
    remove: true,
    scopedSlots: {
      customRender: 'td10'
    }
  },
  {
    title: `tv10`,
    align: "center",
    dataIndex: 'tv10',
    remove: true,
    scopedSlots: {
      customRender: 'tv10'
    }
  },
  {
    title: setDataTitleWithSensorCode('td11'),
    align: "center",
    dataIndex: 'td11',
    remove: true,
    scopedSlots: {
      customRender: 'td11'
    }
  },
  {
    title: `tv11`,
    align: "center",
    dataIndex: 'tv11',
    remove: true,
    scopedSlots: {
      customRender: 'tv11'
    }
  },
  {
    title: setDataTitleWithSensorCode('td12'),
    align: "center",
    dataIndex: 'td12',
    remove: true,
    scopedSlots: {
      customRender: 'td12'
    }
  },
  {
    title: `tv12`,
    align: "center",
    dataIndex: 'tv12',
    remove: true,
    scopedSlots: {
      customRender: 'tv12'
    }
  },
  {
    title: setDataTitleWithSensorCode('td13'),
    align: "center",
    dataIndex: 'td13',
    remove: true,
    scopedSlots: {
      customRender: 'td13'
    }
  },
  {
    title: `tv13`,
    align: "center",
    dataIndex: 'tv13',
    remove: true,
    scopedSlots: {
      customRender: 'tv13'
    }
  },
  {
    title: setDataTitleWithSensorCode('td14'),
    align: "center",
    dataIndex: 'td14',
    remove: true,
    scopedSlots: {
      customRender: 'td14'
    }
  },
  {
    title: `tv14`,
    align: "center",
    dataIndex: 'tv14',
    remove: true,
    scopedSlots: {
      customRender: 'tv14'
    }
  },
  {
    title: setDataTitleWithSensorCode('td15'),
    align: "center",
    dataIndex: 'td15',
    remove: true,
    scopedSlots: {
      customRender: 'td15'
    }
  },
  {
    title: `tv15`,
    align: "center",
    dataIndex: 'tv15',
    remove: true,
    scopedSlots: {
      customRender: 'tv15'
    }
  },
  {
    title: setDataTitleWithSensorCode('td16'),
    align: "center",
    dataIndex: 'td16',
    remove: true,
    scopedSlots: {
      customRender: 'td16'
    }
  },
  {
    title: `tv16`,
    align: "center",
    dataIndex: 'tv16',
    remove: true,
    scopedSlots: {
      customRender: 'tv16'
    }
  }
  ]
}