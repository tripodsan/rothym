import Template from '../core/Template.js';
import ModuleType from '../core/modules/ModuleType.js';

export default function init(registry) {
  registry.register(new Template({
    name: 'Box',
    cellType: 'single',
    core: 'box',
  }).addModule(ModuleType.storage, 0, { maxSize: 100 })
    .addIOPort(ModuleType.output, 0)
    .addIOPort(ModuleType.input, 3)
    .addIOPort(ModuleType.output, 4)
    .addIOPort(ModuleType.input, 1)
    .addIOPort(ModuleType.output, 2)
    .addIOPort(ModuleType.input, 5));

  registry.register(new Template({
    name: 'Conveyor',
    cellType: 'double',
    core: 'cnv',
  }).addModule(ModuleType.storage, 0, { title: 'Cargo Hold' })
    .addIOPort(ModuleType.input, 3)
    .addIOPort(ModuleType.output, 0, 1));

  registry.register(new Template({
    name: 'Mover',
    cellType: 'single',
    core: 'mov',
  }).addIOPort(ModuleType.input, 3)
    .addIOPort(ModuleType.output));

  registry.register(new Template({
    name: 'Miner',
    cellType: 'single',
    core: 'min',
  })
    .addModule(ModuleType.miner)
    .addIOPort(ModuleType.output));

  registry.register(new Template({
    name: 'Tunnel Bore',
    cellType: 'single',
    core: 'bor',
  })
    .addModule(ModuleType.bore, 0, {
      direction: 3,
    })
    .addIOPort(ModuleType.output));

  registry.register(new Template({
    name: 'Smelter',
    cellType: 'double',
    core: 'slt',
  })
    .addModule(ModuleType.smelter)
    .addModule(ModuleType.burner, 1)
    .addIOPort(ModuleType.input, 2, 0, 'fuel')
    .addIOPort(ModuleType.input, 4, 0, 'source')
    .addIOPort(ModuleType.output, 0, 1));

  registry.register(new Template({
    name: 'ESmelter',
    cellType: 'double',
    core: 'eslt',
  })
    .addModule(ModuleType.smelter)
    .addModule(ModuleType.heater, 1)
    .addIOPort(ModuleType.input, 3, 0, 'source')
    .addIOPort(ModuleType.output, 0, 1));

  registry.register(new Template({
    name: 'Grinder',
    cellType: 'single',
    core: 'gnd',
  })
    .addModule(ModuleType.grinder)
    .addIOPort(ModuleType.input, 3)
    .addIOPort(ModuleType.output));

  registry.register(new Template({
    name: 'Assembler',
    cellType: 'single',
    core: 'asm',
  })
    .addIOPort(ModuleType.output)
    .addIOPort(ModuleType.input, 2)
    .addIOPort(ModuleType.input, 4)
    .addModule(ModuleType.puma, 0, {
      recipe_export: true,
      power: 'power:p1',
    }));

  registry.register(new Template({
    name: 'Power Node',
    cellType: 'single',
    core: 'pwr',
  })
    .addModule(ModuleType.power_node, 0));

  registry.register(new Template({
    name: 'Battery',
    cellType: 'triangle',
    core: 'pwr',
  })
    .addModule(ModuleType.capacitor, 0)
    .addModule(ModuleType.capacitor, 1)
    .addModule(ModuleType.capacitor, 2));

  registry.register(new Template({
    name: 'Combustion Engine',
    cellType: 'double',
    core: 'com',
  })
    .addModule(ModuleType.combustion_engine, 0)
    .addModule(ModuleType.storage, 1)
    .addIOPort(ModuleType.input, 3, 0));
}
