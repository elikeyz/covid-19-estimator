const covid19ImpactEstimator = (data) => {
  const {
    periodType, timeToElapse: time, reportedCases, totalHospitalBeds, region
  } = data;
  const { avgDailyIncomeInUSD: avgIncome, avgDailyIncomePopulation: avgPop } = region;

  const currentlyInfected = reportedCases * 10;
  const severeCurrentlyInfected = reportedCases * 50;

  let days = time;
  if (periodType === 'weeks') {
    days *= 7;
  } else if (periodType === 'months') {
    days *= 30;
  }
  const projectionFactor = 2 ** Math.trunc(days / 3);

  const infectionsByRequestedTime = currentlyInfected * projectionFactor;
  const severeInfectionsByRequestedTime = severeCurrentlyInfected * projectionFactor;

  const severeCasesByRequestedTime = Math.trunc(infectionsByRequestedTime * 0.15);
  const severeSevereCasesByRequestedTime = Math.trunc(severeInfectionsByRequestedTime * 0.15);

  const hospitalBeds = totalHospitalBeds * 0.35;
  const hospitalBedsByRequestedTime = Math.trunc(hospitalBeds - severeCasesByRequestedTime);
  const sHospitalBedsByRequestedTime = Math.trunc(hospitalBeds - severeSevereCasesByRequestedTime);

  const casesForICUByRequestedTime = Math.trunc(infectionsByRequestedTime * 0.05);
  const severeCasesForICUByRequestedTime = Math.trunc(severeInfectionsByRequestedTime * 0.05);

  const casesForVentilatorsByRequestedTime = Math.trunc(infectionsByRequestedTime * 0.02);
  const sCasesForVentilatorsByRequestedTime = Math.trunc(severeInfectionsByRequestedTime * 0.02);

  const $sInFlight = Math.trunc((infectionsByRequestedTime * avgIncome * avgPop) / days);
  const s$sInFlight = Math.trunc((severeInfectionsByRequestedTime * avgIncome * avgPop) / days);

  const result = {
    data,
    impact: {
      currentlyInfected,
      infectionsByRequestedTime,
      severeCasesByRequestedTime,
      hospitalBedsByRequestedTime,
      casesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime,
      dollarsInFlight: $sInFlight
    },
    severeImpact: {
      currentlyInfected: severeCurrentlyInfected,
      infectionsByRequestedTime: severeInfectionsByRequestedTime,
      severeCasesByRequestedTime: severeSevereCasesByRequestedTime,
      hospitalBedsByRequestedTime: sHospitalBedsByRequestedTime,
      casesForICUByRequestedTime: severeCasesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime: sCasesForVentilatorsByRequestedTime,
      dollarsInFlight: s$sInFlight
    }
  };

  return result;
};

export default covid19ImpactEstimator;
