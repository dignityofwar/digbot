package core

import (
	"os"
	"os/signal"
)

type Module struct {
	Name       string
	OnInit     func()
	OnBoot     func()
	OnDestroy  func()
	OnShutdown func()
}

type App struct {
	modules       []Module
	initHooks     []func()
	bootBooks     []func()
	destroyHooks  []func()
	shutdownHooks []func()
}

func CreateApp(modules []Module) (a *App) {
	a = &App{
		modules: modules,
	}

	for _, module := range modules {
		if module.OnInit != nil {
			a.initHooks = append(a.initHooks, module.OnInit)
		}

		if module.OnBoot != nil {
			a.bootBooks = append(a.bootBooks, module.OnBoot)
		}

		if module.OnDestroy != nil {
			a.destroyHooks = append(a.destroyHooks, module.OnDestroy)
		}

		if module.OnShutdown != nil {
			a.shutdownHooks = append(a.shutdownHooks, module.OnShutdown)
		}
	}

	return
}

func (a *App) Start() {
	for _, initHook := range a.initHooks {
		initHook()
	}

	for _, bootHook := range a.bootBooks {
		bootHook()
	}
}

func (a *App) Close() {
	for _, destroyHook := range a.destroyHooks {
		destroyHook()
	}

	for _, shutdownHook := range a.shutdownHooks {
		shutdownHook()
	}
}

func (a *App) AwaitExit() {
	defer a.Close()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)
	<-stop
}
