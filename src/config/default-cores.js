import CoreDefinition from '../core/CoreDefinition.js';

import conveyor from './cores/conveyor.js';
import assembler from './cores/assembler.js';
import miner from './cores/miner.js';
import box from './cores/box.js';
import bore from './cores/bore.js';
import smelter from './cores/smelter.js';
import esmelter from './cores/esmelter.js';
import power from './cores/power.js';
import mover from './cores/mover.js';
import combustion from './cores/combustion.js';
import grinder from './cores/grinder.js';

export default function init(registry) {
  registry.register(new CoreDefinition(conveyor));
  registry.register(new CoreDefinition(assembler));
  registry.register(new CoreDefinition(miner));
  registry.register(new CoreDefinition(box));
  registry.register(new CoreDefinition(smelter));
  registry.register(new CoreDefinition(esmelter));
  registry.register(new CoreDefinition(power));
  registry.register(new CoreDefinition(mover));
  registry.register(new CoreDefinition(combustion));
  registry.register(new CoreDefinition(bore));
  registry.register(new CoreDefinition(grinder));
}
