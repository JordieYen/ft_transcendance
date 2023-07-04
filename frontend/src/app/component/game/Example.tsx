import Matter from "matter-js";

const Example = () => {
  // create engine
  const engine = Matter.Engine.create();
  const world = engine.world;

  // create renderer
  const render = Matter.Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: 2050,
      height: 900,
      showAngleIndicator: true,
    },
  });

  Matter.Render.run(render);

  // create runner
  const runner = Matter.Runner.create();
  Matter.Runner.run(runner, engine);

  // add bodies
  const ground = Matter.Bodies.rectangle(400, 575, 800, 50, {
    isStatic: true,
    render: { fillStyle: "#060a19" },
  });

  const rockOptions = { density: 0.001 };
  let rock = Matter.Bodies.polygon(170, 450, 8, 20, rockOptions);

  const anchor = { x: 170, y: 450 };
  const elastic = Matter.Constraint.create({
    pointA: anchor,
    bodyB: rock,
    length: 0.01,
    damping: 0.01,
    stiffness: 0.05,
  });

  Matter.Composite.add(engine.world, [ground, rock, elastic]);

  Matter.Events.on(engine, "afterUpdate", function () {
    if (
      mouseConstraint.mouse.button === -1 &&
      (rock.position.x > 190 || rock.position.y < 430)
    ) {
      // Limit maximum speed of current rock.
      if (Matter.Body.getSpeed(rock) > 45) {
        Matter.Body.setSpeed(rock, 45);
      }

      // Release current rock and add a new one.
      rock = Matter.Bodies.polygon(170, 450, 7, 20, rockOptions);
      Matter.Composite.add(engine.world, rock);
      elastic.bodyB = rock;
    }
  });

  // add mouse control
  const mouse = Matter.Mouse.create(render.canvas),
    mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

  Matter.Composite.add(world, mouseConstraint);

  // keep the mouse in sync with rendering
  render.mouse = mouse;

  // fit the render viewport to the scene
  Matter.Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 2050, y: 900 },
  });
};

export default Example;
