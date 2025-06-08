import type { OKRAgentState } from './types';

export const INITIAL_STATE: OKRAgentState = {
  objectives: [
    // {
    //   id: '1',
    //   title: 'Increase Revenue Growth',
    //   description: 'Drive significant revenue expansion through strategic initiatives',
    //   quarter: 'Q1 2024',
    //   progress: 65,
    //   isCompleted: false,
    //   keyResults: [
    //     {
    //       id: '1-1',
    //       description: 'Acquire 100 new enterprise customers',
    //       progress: 67,
    //       target: 100,
    //       unit: 'customers',
    //       isCompleted: false
    //     },
    //     {
    //       id: '1-2',
    //       description: 'Increase monthly recurring revenue to $500K',
    //       progress: 380000,
    //       target: 500000,
    //       unit: 'USD',
    //       isCompleted: false
    //     }
    //   ]
    // },
    // {
    //   id: '2',
    //   title: 'Improve Product Quality',
    //   description: 'Enhance user experience and reduce technical debt',
    //   quarter: 'Q1 2024',
    //   progress: 45,
    //   isCompleted: false,
    //   keyResults: [
    //     {
    //       id: '2-1',
    //       description: 'Reduce critical bugs by 80%',
    //       progress: 60,
    //       target: 80,
    //       unit: '%',
    //       isCompleted: false
    //     },
    //     {
    //       id: '2-2',
    //       description: 'Achieve 95% customer satisfaction score',
    //       progress: 88,
    //       target: 95,
    //       unit: '%',
    //       isCompleted: false
    //     }
    //   ]
    // }
  ],
  currentQuarter: 'Q1 2024',
  lastUpdated: new Date().toISOString(),
  commitStatus: 'draft',
};