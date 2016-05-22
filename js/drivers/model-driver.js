const makeModelDriver = (initial) => (model$) => {
     var storage = [];
     model$
      .startWith(initial || [])
      .subscribe((model) => {
        storage = model;
      });

      return model$;
}

export default makeModelDriver;
