build:
	docker build -t adesso/loyalty-gpi:latest .
run:
	docker run --name loyalty-gpi1 -p 1880:1880 -d adesso/loyalty-gpi

CONTAINER_ID = $$(docker ps -aqf "name=loyalty-gpi1")
stop:
	docker stop $(CONTAINER_ID)

clean:
	docker rm $(CONTAINER_ID)

rebuild: stop build
