export class Manager {

  protected static instance: Manager;

  public getInstance(): Manager {
    if (!Manager.instance) {
      Manager.instance = new Manager();
    }

    return Manager.instance;
  };
};