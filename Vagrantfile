# -*- mode: ruby -*-
# vi: set ft=ruby :

$bridge = "wlp4s0"

$box = "ubuntu/xenial64"

$cluster = {
  "master" => [
      { :ip => "192.168.0.15", :cpus => 1, :mem => 2048 },
  ],
  "worker" => [
      { :ip => "192.168.0.16", :cpus => 1, :mem => 2048 },
      { :ip => "192.168.0.17", :cpus => 1, :mem => 2048 },
  ],
}

$provisionner=<<-SHELL

    set -x

    echo "Current user for provisionning: $USER"

    # update system
    apt-get update && sudo apt-get upgrade -y

    # install helpers
    apt-get install -y python vim net-tools sed curl wget byobu ranger

    echo 'root:azerty' | chpasswd
    echo 'ubuntu:azerty' | chpasswd

    cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak

    # allow root login
    sed -i -E 's/#?PermitRootLogin.+/PermitRootLogin yes/g' /etc/ssh/sshd_config
    sed -i -E 's/#?PasswordAuthentication.+/PasswordAuthentication yes/g' /etc/ssh/sshd_config

    systemctl restart ssh

    rm /etc/resolv.conf
    echo "nameserver 80.67.169.12" >> /etc/resolv.conf
    echo "nameserver 80.67.169.40" >> /etc/resolv.conf

    # show interfaces
    ip a

SHELL

Vagrant.configure("2") do |config|

  $cluster.each_with_index do |(vmIndex, vmConfigs), index|

    vmConfigs.each_with_index do |info , index|
      hostname = vmIndex + index.to_s

      config.vm.define hostname do |cfg|

        cfg.vm.provider :virtualbox do |vb, override|
          config.vm.box = $box
          override.vm.network :public_network, ip: "#{info[:ip]}", bridge: $bridge
          override.vm.hostname = hostname
          vb.name = hostname
          vb.customize ["modifyvm", :id, "--memory", info[:mem], "--cpus", info[:cpus], "--hwvirtex", "on"]
        end # end provider

        cfg.vm.provision "shell", inline: $provisionner

      end # end config

     end # end vmConfigs
   end # end cluster

end
