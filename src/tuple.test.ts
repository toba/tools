import '@toba/test';
import { makeDuoList, makeTrioList } from './tuple';

describe('DuoList', () => {
   const sampleDuo = () =>
      makeDuoList<string, number>(['one', 1], ['two', 2], ['three', 3]);

   it('makes duo', () => {
      const duo = sampleDuo();

      expect(duo.size()).toBe(3);
      expect(duo.item(1)).toEqual(['two', 2]);
   });

   it('allows items to be added to a duo', () => {
      const duo = sampleDuo();

      expect(duo.push('four', 4)).toBe(4);
      expect(duo.item(3)).toEqual(['four', 4]);
   });

   it('allows items to be popped from a duo', () => {
      const duo = sampleDuo();
      const pair = duo.pop();

      expect(pair).toBeDefined();
      expect(pair![0]).toBe('three');
      expect(pair![1]).toBe(3);
      expect(duo.size()).toBe(2);
   });

   it('returns index for either duo member', () => {
      const duo = sampleDuo();

      expect(duo.indexOf('four')).toBe(-1);
      expect(duo.indexOf('two')).toBe(1);
      expect(duo.indexOf(undefined, 2)).toBe(1);
   });

   it('finds duo member matching predicate', () => {
      const duo = sampleDuo();

      expect(duo.find((_, b) => b == 2)).toEqual(['two', 2]);
   });

   it('can be flattened', () => {
      const duo = sampleDuo();

      expect(duo.flat()).toEqual(['one', 1, 'two', 2, 'three', 3]);
   });
});

describe('TrioList', () => {
   const sampleTrio = (d: Date) =>
      makeTrioList<string, number, Date>(
         ['one', 1, d],
         ['two', 2, d],
         ['three', 3, d]
      );
   it('makes trio', () => {
      const now = new Date();
      const trio = sampleTrio(now);

      expect(trio.size()).toBe(3);
      expect(trio.item(1)).toEqual(['two', 2, now]);
   });

   it('allows items to be added to a trio', () => {
      const now = new Date();
      const trio = sampleTrio(now);

      expect(trio.push('four', 4, now)).toBe(4);
      expect(trio.item(3)).toEqual(['four', 4, now]);
   });

   it('allows items to be popped from a trio', () => {
      const now = new Date();
      const trio = sampleTrio(now);
      const triple = trio.pop();

      expect(triple).toBeDefined();
      expect(triple![0]).toBe('three');
      expect(triple![1]).toBe(3);
      expect(triple![2]).toBe(now);
   });

   it('returns index for any trio member', () => {
      const now = new Date();
      const trio = sampleTrio(now);

      expect(trio.indexOf('four')).toBe(-1);
      expect(trio.indexOf('two')).toBe(1);
      expect(trio.indexOf(undefined, 2)).toBe(1);
      expect(trio.indexOf(undefined, undefined, now)).toBe(0);
   });

   it('finds trio member matching predicate', () => {
      const now = new Date();
      const trio = sampleTrio(now);

      expect(trio.find((_, b) => b == 3)).toEqual(['three', 3, now]);
      expect(trio.find(a => a == 'one')).toEqual(['one', 1, now]);
   });

   it('can be flattened', () => {
      const now = new Date();
      const trio = sampleTrio(now);

      expect(trio.flat()).toEqual([
         'one',
         1,
         now,
         'two',
         2,
         now,
         'three',
         3,
         now
      ]);
   });
});
